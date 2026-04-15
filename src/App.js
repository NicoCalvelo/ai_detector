import { useState } from "react";
import "./App.css";
import { FileText, Link as LinkIcon, Sparkles, ArrowRight } from "lucide-react";
import { ExtractText } from "./services/AnalyzeText";

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
];

const MAX_CHARACTERS = 10000;

function App() {
  const [text, setText] = useState("");
  const [selectedTextId, setSelectedTextId] = useState(null);

  const handleAnalyze = () => {
    console.log("CTA analyser cliqué");
  };

  const handleSelectText = async (item) => {
    const response = await ExtractText(item.url);
    console.log("RESPONSE", response);
    setText(response);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Détection de texte
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Analyse visuelle de texte
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Colle ton contenu dans la zone principale ou charge un exemple
            depuis la colonne de droite pour tester l’interface.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_0.85fr]">
          <section className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur md:p-7">
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
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Analyser le texte
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
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

export default App;
