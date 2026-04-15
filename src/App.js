import { useState } from "react";
import "./App.css";
import { FileText, Link as LinkIcon, Sparkles, ArrowRight } from "lucide-react";
import { ExtractText, DetectText } from "./services/AnalyzeText";

const SAMPLE_TEXTS = [
  {
    id: 1,
    title: "Billet de blog — transition énergétique et économie de la saucisse",
    url: "https://pandasoft.contact/articles/t01-blog-energie",
  },
  {
    id: 2,
    title: "Fil de discussion — cuisine et vie quotidienne",
    url: "https://pandasoft.contact/articles/t02-forum-alimentation",
  },
  {
    id: 3,
    title: "Email système — refus d'installation logicielle",
    url: "https://pandasoft.contact/articles/t03-email-annonce",
  },
  {
    id: 4,
    title: "Article de fond — intelligence artificielle",
    url: "https://pandasoft.contact/articles/t04-article-ia-emploi",
  },
  {
    id: 5,
    title: "Fiche produit — application mobile",
    url: "https://pandasoft.contact/articles/t05-fiche-appli-meditation",
  },
  {
    id: 6,
    title: "Résumé de réunion — projet tech",
    url: "https://pandasoft.contact/articles/t06-reunion-site-interne",
  },
  {
    id: 7,
    title: "Texte académique — biodiversité et niveaux d'organisation du vivant",
    url: "https://pandasoft.contact/articles/t07-academique-biodiversite",
    },
    {
    id: 8,
    title: "Avis client — hôtel (registre familier, expressions populaires)",
    url: "https://pandasoft.contact/articles/t08-avis-hotel-lyon",
    },
    {
    id: 9,
    title: "Tribune — réforme de l'éducation (argumentaire structuré)",
    url: "https://pandasoft.contact/articles/t09-tribune-education-ia",
    },
    {
    id: 10,
    title: "Chronique humoristique — vie quotidienne (ironie, rythme ternaire)",
    url: "https://pandasoft.contact/articles/t10-chronique-reunions-zoom",
    },
];

const MAX_CHARACTERS = 10000;

function App() {
  const [text, setText] = useState("");
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);
  const [manualUrl, setManualUrl] = useState("");
  const [urlError, setUrlError] = useState(null);
  const [urlLoading, setUrlLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setResults(null);
    setAnalyzeError(null);
    try {
      const data = await DetectText(text);
      setResults(data);
    } catch (err) {
      setAnalyzeError(err.response?.data?.erreur || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectText = async (item) => {
    const response = await ExtractText(item.url);
    console.log("RESPONSE", response);
    setText(response);
  };

  const handleManualUrl = async () => {
    if (!manualUrl.trim()) return;
    setUrlError(null);
    setUrlLoading(true);
    try {
      const response = await ExtractText(manualUrl.trim());
      setText(response);
      setSelectedTextId(null);
    } catch (err) {
      setUrlError(err.message ?? "Impossible de charger l'URL.");
    } finally {
      setUrlLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-slate-50 to-slate-300 px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Détection de texte d'IA gratuite
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-purple-900 md:text-5xl">
            Analyse visuelle de texte
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Colle ton contenu dans la zone principale ou charge un exemple
            depuis la colonne de droite pour tester l’interface.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-[28px] col-span-2 border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur md:p-7">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 md:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
                    Ton texte
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Saisie libre ou texte préchargé depuis une URL.
                  </p>
                </div>

                <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                  {text.length} / {MAX_CHARACTERS}
                </div>
              </div>

              <textarea
                value={text}
                onChange={(e) =>
                  setText(e.target.value.slice(0, MAX_CHARACTERS))
                }
                placeholder="Colle ou écris ton texte ici..."
                className="min-h-[420px] w-full resize-none rounded-[22px] border border-slate-200 bg-white px-5 py-4 text-base leading-7 text-slate-800 shadow-inner outline-none transition duration-200 placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isLoading || !text.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isLoading ? "Analyse en cours..." : "Analyser le texte"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {analyzeError && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                <strong>Erreur :</strong> {analyzeError}
              </div>
            )}

            {results && (
              <div className="mt-8 grid grid-cols-1 gap-5">
                {results.map((result) => (
                  <ServiceCard key={result.service} result={result} />
                ))}
              </div>
            )}
          </section>

          <aside className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur md:p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">
                Textes à charger
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Clique sur un titre pour afficher un texte d’exemple dans la
                zone principale.
              </p>
            </div>
            <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-sm font-medium text-slate-700">
                Charger depuis une URL
              </p>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualUrl()}
                  placeholder="https://..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
                <button
                  type="button"
                  onClick={handleManualUrl}
                  disabled={urlLoading || !manualUrl.trim()}
                  className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {urlLoading ? "..." : "OK"}
                </button>
              </div>
              {urlError && (
                <p className="mt-2 text-xs text-red-600">{urlError}</p>
              )}
            </div>
            <div className="space-y-3">
              {SAMPLE_TEXTS.map((item) => {
                const isActive = selectedTextId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectText(item)}
                    className={`group w-full rounded-2xl border p-4 text-left transition duration-200 ${
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                        : "border-slate-200 bg-slate-50 text-slate-900 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-xl p-2.5 ${
                          isActive
                            ? "bg-white/10"
                            : "bg-white text-slate-700 shadow-sm"
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold md:text-base">
                          {item.title}
                        </p>

                        <div
                          className={`mt-2 flex items-center gap-2 text-xs ${
                            isActive ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          <LinkIcon className="h-3.5 w-3.5" />
                          <span className="truncate">{item.url}</span>
                        </div>

                        <div
                          className={`mt-3 text-xs font-medium ${
                            isActive
                              ? "text-violet-200"
                              : "text-violet-600 group-hover:text-violet-700"
                          }`}
                        >
                          Charger ce texte
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {!selectedTextId && (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                Aucun texte sélectionné pour le moment.
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

const VERDICT_STYLES = {
  HUMAIN: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  IA: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  HYBRIDE: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  INDETERMINABLE: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
  },
};

const SERVICE_LABELS = {
  huggingface: "HuggingFace",
  openai: "OpenAI GPT-4o",
  sapling: "Sapling",
};

function ServiceCard({ result }) {
  const { service, success, data, error } = result;
  const label = SERVICE_LABELS[service] ?? service;

  const isRateLimit =
    error?.includes("429") || error?.toLowerCase().includes("rate limit");

  return (
    <div className="rounded-[24px] border border-gray-300 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">{label}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            success
              ? "bg-green-100 text-green-700"
              : isRateLimit
                ? "bg-orange-100 text-orange-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {success ? "OK" : isRateLimit ? "Rate limit" : "Erreur"}
        </span>
      </div>

      {success && data ? (
        <>
          {data.verdict &&
            (() => {
              const style =
                VERDICT_STYLES[data.verdict] ?? VERDICT_STYLES.INDETERMINABLE;
              return (
                <div
                  className={`mb-4 rounded-xl border px-4 py-3 ${style.bg} ${style.border}`}
                >
                  <p className={`text-xl font-bold ${style.text}`}>
                    {data.verdict}
                  </p>
                  {typeof data.confidence === "number" && (
                    <>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/60">
                        <div
                          className={`h-2 rounded-full ${style.text.replace("text", "bg")}`}
                          style={{ width: `${data.confidence}%` }}
                        />
                      </div>
                      <p className={`mt-1 text-xs font-medium ${style.text}`}>
                        {data.confidence}% de confiance
                      </p>
                    </>
                  )}
                </div>
              );
            })()}

          {data.indices?.length > 0 && (
            <ul className="space-y-1.5">
              {data.indices.map((idx, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  {idx}
                </li>
              ))}
            </ul>
          )}

          {data.label && (
            <p className="text-sm text-slate-700">
              <span className="font-medium">Label :</span> {data.label}
            </p>
          )}
          {typeof data.score === "number" && (
            <>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-violet-500"
                  style={{ width: `${Math.round(data.score * 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {Math.round(data.score * 100)}% de confiance
              </p>
            </>
          )}

          {data.limite && (
            <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs italic text-slate-500">
              {data.limite}
            </p>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
          {isRateLimit ? (
            <p>Quota atteint. Réessaie dans quelques instants.</p>
          ) : (
            <p className="break-words">{error ?? "Résultat indisponible."}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
