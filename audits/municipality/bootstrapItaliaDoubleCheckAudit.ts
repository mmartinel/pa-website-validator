"use strict";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import lighthouse from "lighthouse";

const Audit = lighthouse.Audit;

const greenResult =
  "Il sito utilizza la libreria Bootstrap Italia in una versione idonea.";
const redResult =
  "Il sito non utilizza la libreria Bootstrap Italia o ne utilizza una versione datata.";
const libraryName = "Bootstrap italia";

class LoadAudit extends Audit {
  static get meta() {
    return {
      id: "municipality-ux-ui-consistency-bootstrap-italia-double-check",
      title:
        "C.SI.1.2 - LIBRERIA DI ELEMENTI DI INTERFACCIA - Il sito comunale deve utilizzare la libreria Bootstrap Italia.",
      failureTitle:
        "C.SI.1.2 - LIBRERIA DI ELEMENTI DI INTERFACCIA - Il sito comunale deve utilizzare la libreria Bootstrap Italia.",
      scoreDisplayMode: Audit.SCORING_MODES.BINARY,
      description:
        "CONDIZIONI DI SUCCESSO: la versione di libreria Bootstrap Italia in uso è uguale o superiore alla 2.0; MODALITÀ DI VERIFICA: viene verificata la presenza della libreria Bootstrap Italia e la versione in uso individuando la proprietà CSS --bootstrap-italia-version all’interno del selettore :root , o la variabile globale window.BOOTSTRAP_ITALIA_VERSION; RIFERIMENTI TECNICI E NORMATIVI: [Docs Italia, documentazione Modello Comuni](https://docs.italia.it/italia/designers-italia/design-comuni-docs/it/v2022.1/index.html)",
      requiredArtifacts: [
        "bootstrapItaliaSelectorCheck",
        "bootstrapItaliaCheck",
      ],
    };
  }

  static async audit(
    artifacts: LH.Artifacts & {
      bootstrapItaliaCheck: string;
      bootstrapItaliaSelectorCheck: string;
    }
  ): Promise<{ score: number; details: LH.Audit.Details.Table }> {
    const bootstrapItaliaVariableVersion =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      artifacts.bootstrapItaliaCheck?.toString().replaceAll('"', "") ?? "";
    const bootstrapItaliaSelectorVariableVersion =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      artifacts.bootstrapItaliaSelectorCheck?.toString().replaceAll('"', "") ??
      "";

    const headings = [
      {
        key: "result",
        itemType: "text",
        text: "Risultato",
      },
      {
        key: "library_name",
        itemType: "text",
        text: "Nome libreria in uso",
      },
      {
        key: "library_version",
        itemType: "text",
        text: "Versione libreria in uso",
      },
    ];
    const items = [
      {
        result: redResult,
        library_name: "",
        library_version: "",
      },
    ];
    let score = 0;

    if (
      bootstrapItaliaVariableVersion !== null &&
      bootstrapItaliaVariableVersion
    ) {
      items[0].library_version = bootstrapItaliaVariableVersion;
      items[0].library_name = libraryName;

      if (await checkVersion(bootstrapItaliaVariableVersion)) {
        score = 1;
        items[0].result = greenResult;
      }
    } else if (
      bootstrapItaliaSelectorVariableVersion !== null &&
      bootstrapItaliaSelectorVariableVersion
    ) {
      items[0].library_version = bootstrapItaliaSelectorVariableVersion;
      items[0].library_name = libraryName;

      if (await checkVersion(bootstrapItaliaSelectorVariableVersion)) {
        score = 1;
        items[0].result = greenResult;
      }
    }

    return {
      score: score,
      details: Audit.makeTableDetails(headings, items),
    };
  }
}

module.exports = LoadAudit;

const checkVersion = async (version: string) => {
  let result = false;

  const versionValues = version.split(".");
  if (versionValues.length > 0) {
    const majorVersion = parseInt(versionValues[0]);

    if (majorVersion >= 2) {
      result = true;
    }
  }

  return result;
};
