import * as React from "react";
import {
  PlasmicComponent,
  extractPlasmicQueryData,
  ComponentRenderData,
  PlasmicRootProvider,
} from "@plasmicapp/loader-nextjs";
import type { GetStaticPaths, GetStaticProps } from "next";
import "@supabase/auth-helpers-nextjs";
import useSWR from "swr";
import Error from "next/error";
import { useRouter } from "next/router";
import { PLASMIC } from "@/plasmic-init";
import { PLASMIC_AUTH_DATA_KEY } from "@/utils/cache-keys";

export default function PlasmicLoaderPage(props: {
  plasmicData?: ComponentRenderData;
  queryCache?: Record<string, any>;
  notFound?: boolean;
}) {
  const { plasmicData, queryCache, notFound } = props;
  const router = useRouter();
  const { isUserLoading, plasmicUserToken, plasmicUser } = usePlasmicAuthData();

  // Redirect naar /notfound als de pagina niet bestaat (alleen client-side)
  React.useEffect(() => {
    if (notFound) {
      router.push("/notfound");
    }
  }, [notFound, router]);

  if (notFound) {
    return null; // Tijdelijk lege pagina tijdens redirect
  }

  if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
    return null; // Fallback voor andere gevallen
  }

  const pageMeta = plasmicData.entryCompMetas[0];
  return (
    <PlasmicRootProvider
      loader={PLASMIC}
      prefetchedData={plasmicData}
      prefetchedQueryData={queryCache}
      pageParams={pageMeta.params}
      pageQuery={router.query}
      isUserLoading={isUserLoading}
      user={plasmicUser}
      userAuthToken={plasmicUserToken}
    >
      <PlasmicComponent component={pageMeta.displayName} />
    </PlasmicRootProvider>
  );
}

// Functie voor Plasmic auth-data (onveranderd)
function usePlasmicAuthData() {
  const { isLoading, data } = useSWR(PLASMIC_AUTH_DATA_KEY, async () => {
    const data = await fetch("/api/plasmic-auth").then((r) => r.json());
    return data;
  });
  return {
    isUserLoading: isLoading,
    plasmicUser: data?.plasmicUser,
    plasmicUserToken: data?.plasmicUserToken,
  };
}

// getStaticProps (alleen 404-logica aangepast)
export const getStaticProps: GetStaticProps = async (context) => {
  const { catchall } = context.params ?? {};
  const plasmicPath =
    typeof catchall === "string"
      ? catchall
      : Array.isArray(catchall)
      ? `/${catchall.join("/")}`
      : "/";

  const plasmicData = await PLASMIC.maybeFetchComponentData(plasmicPath);

  // Belangrijk: return { notFound: true } als de pagina niet bestaat
  if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
    return { notFound: true };
  }

  const pageMeta = plasmicData.entryCompMetas[0];
  const queryCache = await extractPlasmicQueryData(
    <PlasmicRootProvider
      loader={PLASMIC}
      prefetchedData={plasmicData}
      pageParams={pageMeta.params}
    >
      <PlasmicComponent component={pageMeta.displayName} />
    </PlasmicRootProvider>
  );

  return { props: { plasmicData, queryCache }, revalidate: 60 };
};

// getStaticPaths (onveranderd)
export const getStaticPaths: GetStaticPaths = async () => {
  const pageModules = await PLASMIC.fetchPages();
  return {
    paths: pageModules.map((mod) => ({
      params: {
        catchall: mod.path.substring(1).split("/"),
      },
    })),
    fallback: "blocking",
  };
};