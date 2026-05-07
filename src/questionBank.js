import { hrQuestions } from "./data/hrquestions";

import { softwareBasic } from "./data/softwarebasic";
import { softwareIntermediate } from "./data/softwareintermediate";
import { softwareHardcore } from "./data/softwarehardcore";
import { softwareFinal } from "./data/softwarefinal";

import { dsBasic } from "./data/dsbasic";
import { dsIntermediate } from "./data/dsintermediate";
import { dsHardcore } from "./data/dshardcore";
import { dsFinal } from "./data/dsfinal";

export const questionBank = {

  // ✅ COMMON HR POOL
  hr: hrQuestions,

  // ✅ SOFTWARE TRACK
  software: {
    basic: softwareBasic,
    intermediate: softwareIntermediate,
    hardcore: softwareHardcore,
    final: softwareFinal
  },

  // ✅ DATA SCIENCE TRACK
  dataScience: {
    basic: dsBasic,
    intermediate: dsIntermediate,
    hardcore: dsHardcore,
    final: dsFinal
  }

};