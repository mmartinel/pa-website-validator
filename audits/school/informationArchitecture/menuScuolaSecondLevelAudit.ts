"use strict";

import { CheerioAPI } from "cheerio";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import lighthouse from "lighthouse";
import got from "got";
import * as cheerio from "cheerio";

import { checkOrder } from "../../../utils/utils";
import { secondaryMenuItems } from "../../../storage/school/menuItems";

const Audit = lighthouse.Audit;

class LoadAudit extends Audit {
  static get meta() {
    return {
      id: "school-menu-scuola-second-level-structure-match-model",
      title: 'Le voci di secondo livello per "La scuola" rispettano il modello',
      failureTitle:
        "Il menu di secondo livello non contiene almeno il 30% delle voci obbligatorie del modello con nome corretto",
      scoreDisplayMode: Audit.SCORING_MODES.NUMERIC,
      description:
        'Test per verificare la conformità delle voci di secondo livello per la voce "La scuola" del menù',
      requiredArtifacts: ["menuStructureScuolaSecondLevelMatchModel"],
    };
  }

  static async audit(
    artifacts: LH.Artifacts & {
      menuStructureScuolaSecondLevelMatchModel: string;
    }
  ): Promise<{ score: number; details: LH.Audit.Details.Table }> {
    const url = artifacts.menuStructureScuolaSecondLevelMatchModel;

    const headings = [
      {
        key: "missing_voices",
        itemType: "text",
        text: "Voci di secondo livello per 'Scuola' mancanti o con nome errato",
      },
      {
        key: "missing_voices_percentage",
        itemType: "text",
        text: "Percentuale voci mancanti",
      },
      {
        key: "correct_order",
        itemType: "text",
        text: "Sequenzialità delle voci obbligatorie (tra quelle presenti) rispettato",
      },
      {
        key: "elements_not_in_correct_order",
        itemType: "text",
        text: "Voci (tra quelle presenti) obbligatorie che non rispettano la sequenzialità",
      },
      {
        key: "model_link",
        itemType: "url",
        text: "Link al modello di riferimento",
      },
    ];

    let score = 0;

    const response = await got(url);
    const $: CheerioAPI = cheerio.load(response.body);

    const secondaryMenuScuolaItems: Array<string> = secondaryMenuItems.Scuola;

    const headerUl = $("#menu-la-scuola").find("li");
    let numberOfMandatoryVoicesPresent = 0;
    const elementsFound: Array<string> = [];
    for (const element of headerUl) {
      if (secondaryMenuScuolaItems.includes($(element).text().trim())) {
        numberOfMandatoryVoicesPresent++;
      }

      elementsFound.push($(element).text().trim());
    }

    const missingVoicesPercentage =
      ((secondaryMenuScuolaItems.length - numberOfMandatoryVoicesPresent) /
        secondaryMenuScuolaItems.length) *
      100;

    let correctOrder = true;
    const correctOrderResult = await checkOrder(
      secondaryMenuScuolaItems,
      elementsFound
    );
    if (correctOrderResult.numberOfElementsNotInSequence > 0) {
      correctOrder = false;
    }

    if (missingVoicesPercentage > 30) {
      score = 0;
    } else if (missingVoicesPercentage <= 30 && !correctOrder) {
      score = 0.5;
    } else if (missingVoicesPercentage <= 30 && correctOrder) {
      score = 1;
    }

    const items = [
      {
        missing_voices: secondaryMenuScuolaItems
          .filter((val) => !elementsFound.includes(val))
          .join(", "),
        missing_voices_percentage: missingVoicesPercentage.toFixed(0) + "%",
        correct_order: correctOrder,
        elements_not_in_correct_order:
          correctOrderResult.elementsNotInSequence.join(", "),
        model_link:
          "https://docs.google.com/drawings/d/1qzpCZrTc1x7IxdQ9WEw_wO0qn-mUk6mIRtSgJlmIz7g/edit",
      },
    ];

    return {
      score: score,
      details: Audit.makeTableDetails(headings, items),
    };
  }
}

module.exports = LoadAudit;
