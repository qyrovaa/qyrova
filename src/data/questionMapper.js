// ================= CS/IT =================
import { softwareBasic } from "./softwarebasic";
import { softwareIntermediate } from "./softwareintermediate";
import { softwareHardcore } from "./softwarehardcore";

import { dsBasic } from "./dsbasic";
import { dsIntermediate } from "./dsintermediate";
import { dsHardcore } from "./dshardcore";

import { cloudInterviewMixed } from "./cloudfinal";
import { cyberBasic } from "./cybersecuritybasic";
import { cyberIntermediate } from "./cybersecurityintermediate";
import { cyberHardcore } from "./cybersecurityhardcore";

import { devopsInterviewMixed } from "./devopsfinal";

// ================= ECE =================
import { embeddedInterviewMixed } from "./embeddedfinal";
import { vlsiInterviewMixed } from "./vlsifinal";
import { communicationBasic } from "./commbasic";
import { communicationIntermediate } from "./commintermediate";
import { communicationInterviewMixed } from "./commfinal";
import { electronicsInterviewMixed } from "./electronicsfinal";

// ================= EE =================
import { powerBasic } from "./psbasic";
import { powerIntermediate } from "./psintermediate";
import { powerHardcore } from "./pshardcore";

import { controlBasic } from "./csbasic";
import { controlIntermediate } from "./csintermediate";
import { controlHardcore } from "./cshardcore";

import { electricalDesignBasic } from "./electricaldesignbasic";
import { electricalDesignIntermediate } from "./electricaldesignintermediate";
import { electricalDesignHardcore } from "./electricaldesignhardcore";

import { renewableInterviewMixed } from "./renewablefinal";

// ================= Mechanical =================
import { designBasic } from "./designbasic";
import { designIntermediate } from "./designintermediate";
import { designHardcore } from "./designhardcore";

import { productionInterviewMixed } from "./productionfinal";
import { automotiveInterviewMixed } from "./automotivefinal";
import { hvacInterviewMixed } from "./hvacfinal";

const questionBank = {
  "software developer": {
    basic: softwareBasic,
    intermediate: softwareIntermediate,
    hardcore: softwareHardcore
  },

  "data scientist": {
    basic: dsBasic,
    intermediate: dsIntermediate,
    hardcore: dsHardcore
  },

  "cloud engineer": {
    basic: cloudInterviewMixed,
    intermediate: cloudInterviewMixed,
    hardcore: cloudInterviewMixed
  },

  "cybersecurity engineer": {
    basic: cyberBasic,
    intermediate: cyberIntermediate,
    hardcore: cyberHardcore
  },

  "devops engineer": {
    basic: devopsInterviewMixed,
    intermediate: devopsInterviewMixed,
    hardcore: devopsInterviewMixed
  },

  "embedded system engineer": {
    basic: embeddedInterviewMixed,
    intermediate: embeddedInterviewMixed,
    hardcore: embeddedInterviewMixed
  },

  "vlsi/semiconductor engineer": {
    basic: vlsiInterviewMixed,
    intermediate: vlsiInterviewMixed,
    hardcore: vlsiInterviewMixed
  },

  "communication/telecom engineer": {
    basic: communicationBasic,
    intermediate: communicationIntermediate,
    hardcore: communicationInterviewMixed
  },

  "electronics design engineer": {
    basic: electronicsInterviewMixed,
    intermediate: electronicsInterviewMixed,
    hardcore: electronicsInterviewMixed
  },

  "power system engineer": {
    basic: powerBasic,
    intermediate: powerIntermediate,
    hardcore: powerHardcore
  },

  "control system engineer": {
    basic: controlBasic,
    intermediate: controlIntermediate,
    hardcore: controlHardcore
  },

  "electrical design engineer": {
    basic: electricalDesignBasic,
    intermediate: electricalDesignIntermediate,
    hardcore: electricalDesignHardcore
  },

  "renewable energy engineer": {
    basic: renewableInterviewMixed,
    intermediate: renewableInterviewMixed,
    hardcore: renewableInterviewMixed
  },

  "design engineer (CAD/CAE)": {
    basic: designBasic,
    intermediate: designIntermediate,
    hardcore: designHardcore
  },

  "production/manufacturing engineer": {
    basic: productionInterviewMixed,
    intermediate: productionInterviewMixed,
    hardcore: productionInterviewMixed
  },

  "automotive engineer": {
    basic: automotiveInterviewMixed,
    intermediate: automotiveInterviewMixed,
    hardcore: automotiveInterviewMixed
  },

  "hvac/thermal engineer": {
    basic: hvacInterviewMixed,
    intermediate: hvacInterviewMixed,
    hardcore: hvacInterviewMixed
  }
};

export default questionBank;