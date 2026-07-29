import EcgQiApp from "../EcgQiApp";

export default async function AppPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  return <EcgQiApp initialPath={`/${slug.join("/")}`} />;
}
