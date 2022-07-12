"use strict";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import lighthouse from "lighthouse";

const Audit = lighthouse.Audit;

class LoadAudit extends Audit {
  static get meta() {
    return {
      id: "school-informative-cloud-infrastructure",
      title:
        "R.SC.2.3 - INFRASTRUTTURE CLOUD - Il sito della scuola deve essere ospitato su infrastrutture qualificate ai sensi della normativa vigente.",
      failureTitle:
        "R.SC.2.3 - INFRASTRUTTURE CLOUD - Il sito della scuola deve essere ospitato su infrastrutture qualificate ai sensi della normativa vigente.",
      scoreDisplayMode: Audit.SCORING_MODES.INFORMATIVE,
      description:
        "RIFERIMENTI TECNICI E NORMATIVI: per consentire un'erogazione più sicura, efficiente e scalabile del sito della scuola, può essere utile considerare di impostare l'infrastruttura che lo ospita in cloud, secondo quanto descritto nella [Strategia Cloud Italia](https://cloud.italia.it/strategia-cloud-pa/).",
      requiredArtifacts: [],
    };
  }

  static async audit(): Promise<{ score: number }> {
    return {
      score: 1,
    };
  }
}

module.exports = LoadAudit;
