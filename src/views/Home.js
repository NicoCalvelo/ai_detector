import React, { useState } from "react";
import { FileText, Link as LinkIcon, Sparkles } from "lucide-react";

const SAMPLE_TEXTS = [
  {
    id: 1,
    title: "Article produit IA",
    url: "https://example.com/article-1",
  },
  {
    id: 2,
    title: "Billet de blog marketing",
    url: "https://example.com/article-2",
  },
  {
    id: 3,
    title: "Texte académique",
    url: "https://example.com/article-3",
  },
  {
    id: 4,
    title: "Article technique",
    url: "https://example.com/article-4",
  },
];

const MAX_CHARACTERS = 10000;

export default function GptZeroUiOnlyView() {
  const [text, setText] = useState("");
  const [selectedTextId, setSelectedTextId] = useState(null);

  const handleAnalyze = () => {
    console.log("CTA analyser cliqué");
  };

  const handleSelectText = (item) => {
    setSelectedTextId(item.id);
    setText(`Texte chargé depuis : ${item.url}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1.6fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                <Sparkles className="h-4 w-4" />
                Détection de texte
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Vérifie ton texte
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-base">
                Colle ton texte dans la zone ci-dessous puis clique sur le
                bouton pour lancer l’action.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 md:p-5">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARACTERS))}
              placeholder="Colle ou écris ton texte ici..."
              className="min-h-[380px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-5 text-base text-slate-800 outline-none transition focus:border-slate-400"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-slate-500">
                {text.length} / {MAX_CHARACTERS} caractères
              </span>

              <button
                type="button"
                onClick={handleAnalyze}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Analyser le texte
              </button>
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Textes à charger
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Clique sur un titre pour remplir la zone de texte avec un contenu
              récupéré depuis une URL.
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
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 rounded-xl p-2 ${
                        isActive ? "bg-white/10" : "bg-white"
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {item.title}
                      </p>
                      <div
                        className={`mt-2 flex items-center gap-2 text-xs ${
                          isActive ? "text-slate-200" : "text-slate-500"
                        }`}
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                        <span className="truncate">{item.url}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
