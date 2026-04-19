import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Heart, Loader2 } from "lucide-react";
import { SiteTemplate } from "../components/site/SiteTemplate";
import { getDraftBySlug, draftToLoveData } from "../../lib/api";
import type { LoveData } from "../../lib/types";

export function LoveSitePage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<LoveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getDraftBySlug(slug)
      .then((d) => {
        if (!d) {
          setNotFound(true);
          return;
        }
        if (d.status === "pending") {
          setNotFound(true);
          return;
        }
        setData(draftToLoveData(d));
        document.title = `${d.person1} & ${d.person2} — nossohistoria.love`;
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 text-center">
        <div>
          <Heart className="w-12 h-12 text-rose-400 mx-auto mb-6" fill="currentColor" />
          <h1
            className="text-white mb-3"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.8rem, 5vw, 2.5rem)" }}
          >
            Site não encontrado
          </h1>
          <p className="text-white/60 mb-8">Verifique o link ou crie o seu próprio.</p>
          <Link
            to="/"
            className="inline-block px-8 py-3 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors"
            style={{ fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.15em" }}
          >
            CRIAR O MEU
          </Link>
        </div>
      </div>
    );
  }

  return <SiteTemplate data={data} />;
}
