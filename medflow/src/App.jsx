import {
  Activity, Users, Stethoscope, FlaskConical,
  ClipboardCheck, Pill, Search, Plus,
  ArrowRight, HeartPulse, BrainCircuit,
  CheckCircle2, AlertTriangle, User, LogOut,
  Sparkles, Trash2, Mic, FileText, Check, ChevronRight,
  ActivitySquare, Settings, BedDouble, Camera
} from 'lucide-react';

import { supabase } from './lib/supabaseClient';
import React, { useState, useEffect } from 'react';
// --- Grok API Configuration ---
const GROK_API_KEY = "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";

// Grok AI Fetch Function
const fetchGrokInsight = async (promptText) => {
  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer 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'
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are Grok, an advanced AI clinical assistant helping a doctor." },
          { role: "user", content: promptText }
        ],
        model: "grok-beta",
        temperature: 0.3
      })
    });
    const suggestNegHistoryAndTests = async (complaint, symptoms) => {
      const prompt = `Complaint: ${complaint}, Symptoms: ${symptoms}. Return JSON: {"negativeHistory": [...], "investigations": [...]}`;
      const result = await fetchGrokInsight(prompt);
      // parse result, setNegHistorySuggestions(...), setInvestigationSuggestions(...)
    };

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content; // આ તમને Grok નો જવાબ આપશે

  } catch (error) {
    console.error("Grok API Error:", error);
    return "Error fetching data from Grok AI.";
  }
};

// --- Initial Patients List ---
const INITIAL_PATIENTS = [
  { id: '#9', name: 'chaudhary', age: '28y', gender: 'male', uhid: 'EHR572288', triage: 'GREEN', status: 'Doctor', complaint: 'Headache for 2 days', vitals: { bp: '120/80', pulse: '78', temp: '98.6', spo2: '98' } },
  { id: '#8', name: 'Kavitha Rao', age: '24y', gender: 'female', uhid: 'EHR100004', triage: 'GREEN', status: 'Doctor', complaint: 'Labour pain, 38 wks', vitals: { bp: '130/85', pulse: '82', temp: '99.0', spo2: '99' } },
  { id: '#7', name: 'Hadiya', age: '23y', gender: 'female', uhid: 'EHR614172', triage: 'GREEN', status: 'Doctor', complaint: 'Poor feeding in baby', vitals: { bp: '110/70', pulse: '110', temp: '98.4', spo2: '97' } },
  { id: '#3', name: 'viko', age: '58y', gender: 'male', uhid: 'EHR100003', triage: 'RED', status: 'Nursing', complaint: 'Head injury after RTA', vitals: null },
  { id: '#1', name: 'Ramesh chaudhary', age: '45y', gender: 'male', uhid: 'EHR100001', triage: 'GREEN', status: 'Pharmacy', complaint: 'Fever and body ache', vitals: { bp: '124/82', pulse: '88', temp: '101.2', spo2: '96' }, diagnoses: ['Viral Fever'], prescriptions: [{id: 1, name: 'Tab Paracetamol 500mg', dosage: '1-1-1', duration: '3 Days'}] },
];

// --- Comprehensive Symptoms DB ---
const SYMPTOMS_DB = [
  // General Medicine
  { id: 'gm1', category: 'General Medicine', name: 'Fever / Pyrexia' },
  { id: 'gm2', category: 'General Medicine', name: 'Fatigue / Lethargy' },
  { id: 'gm3', category: 'General Medicine', name: 'Unexplained Weight Loss' },
  { id: 'gm4', category: 'General Medicine', name: 'Peripheral Edema' },
  { id: 'gm5', category: 'General Medicine', name: 'Jaundice / Icterus' },
  { id: 'gm6', category: 'General Medicine', name: 'Cyanosis' },
  { id: 'gm7', category: 'General Medicine', name: 'Clubbing of Digits' },
  { id: 'gm8', category: 'General Medicine', name: 'Syncope / Fainting' },

  // Infectious Disease
  { id: 'id1', category: 'Infectious Disease', name: 'Chills' },
  { id: 'id2', category: 'Infectious Disease', name: 'Rigors (Shaking Chills)' },
  { id: 'id3', category: 'Infectious Disease', name: 'Night Sweats' },
  { id: 'id4', category: 'Infectious Disease', name: 'Diaphoresis' },
  { id: 'id5', category: 'Infectious Disease', name: 'Malaise' },
  { id: 'id6', category: 'Infectious Disease', name: 'Myalgia (Muscle Aches)' },
  { id: 'id7', category: 'Infectious Disease', name: 'Arthralgia (Joint Pain)' },
  { id: 'id8', category: 'Infectious Disease', name: 'Anorexia' },
  { id: 'id9', category: 'Infectious Disease', name: 'Headache' },
  { id: 'id10', category: 'Infectious Disease', name: 'Nuchal Rigidity' },
  { id: 'id11', category: 'Infectious Disease', name: 'Photophobia' },
  { id: 'id12', category: 'Infectious Disease', name: 'Phonophobia' },
  { id: 'id13', category: 'Infectious Disease', name: 'Altered Mental Status (Confusion/Delirium)' },
  { id: 'id14', category: 'Infectious Disease', name: 'Seizures' },
  { id: 'id15', category: 'Infectious Disease', name: 'Maculopapular Rash' },
  { id: 'id16', category: 'Infectious Disease', name: 'Petechiae' },
  { id: 'id17', category: 'Infectious Disease', name: 'Purpura' },
  { id: 'id18', category: 'Infectious Disease', name: 'Vesicular Rash' },
  { id: 'id19', category: 'Infectious Disease', name: 'Pustular Lesions' },
  { id: 'id20', category: 'Infectious Disease', name: 'Cutaneous or Mucosal Ulcers' },
  { id: 'id21', category: 'Infectious Disease', name: 'Erythema' },
  { id: 'id22', category: 'Infectious Disease', name: 'Eschar (Necrotic Tissue/Scab)' },
  { id: 'id23', category: 'Infectious Disease', name: 'Pruritus (Itching)' },
  { id: 'id24', category: 'Infectious Disease', name: 'Lymphadenopathy' },
  { id: 'id25', category: 'Infectious Disease', name: 'Cough' },
  { id: 'id26', category: 'Infectious Disease', name: 'Sputum Production' },
  { id: 'id27', category: 'Infectious Disease', name: 'Hemoptysis' },
  { id: 'id28', category: 'Infectious Disease', name: 'Dyspnea' },
  { id: 'id29', category: 'Infectious Disease', name: 'Tachypnea' },
  { id: 'id30', category: 'Infectious Disease', name: 'Coryza (Nasal Inflammation)' },
  { id: 'id31', category: 'Infectious Disease', name: 'Rhinorrhea' },
  { id: 'id32', category: 'Infectious Disease', name: 'Sore Throat (Pharyngitis)' },
  { id: 'id33', category: 'Infectious Disease', name: 'Odynophagia (Painful Swallowing)' },
  { id: 'id34', category: 'Infectious Disease', name: 'Dysphagia (Difficulty Swallowing)' },
  { id: 'id35', category: 'Infectious Disease', name: 'Nausea' },
  { id: 'id36', category: 'Infectious Disease', name: 'Vomiting' },
  { id: 'id37', category: 'Infectious Disease', name: 'Watery Diarrhea' },
  { id: 'id38', category: 'Infectious Disease', name: 'Dysentery (Bloody Diarrhea)' },
  { id: 'id39', category: 'Infectious Disease', name: 'Tenesmus' },
  { id: 'id40', category: 'Infectious Disease', name: 'Abdominal Pain/Cramping' },
  { id: 'id41', category: 'Infectious Disease', name: 'Dysuria (Painful Urination)' },
  { id: 'id42', category: 'Infectious Disease', name: 'Urinary Frequency' },
  { id: 'id43', category: 'Infectious Disease', name: 'Urinary Urgency' },
  { id: 'id44', category: 'Infectious Disease', name: 'Hematuria' },
  { id: 'id45', category: 'Infectious Disease', name: 'Flank Pain' },
  { id: 'id46', category: 'Infectious Disease', name: 'Urethral Discharge' },
  { id: 'id47', category: 'Infectious Disease', name: 'Vaginal Discharge' },
  { id: 'id48', category: 'Infectious Disease', name: 'Pelvic Pain' },
  { id: 'id49', category: 'Infectious Disease', name: 'Genital Ulcers or Warts' },
  { id: 'id50', category: 'Infectious Disease', name: 'Bone Pain' },
  { id: 'id51', category: 'Infectious Disease', name: 'Joint Swelling/Effusion' },
  { id: 'id52', category: 'Infectious Disease', name: 'Muscle Spasms/Rigidity' },
  { id: 'id53', category: 'Infectious Disease', name: 'Otalgia (Ear Pain)' },
  { id: 'id54', category: 'Infectious Disease', name: 'Otorrhea (Ear Discharge)' },
  { id: 'id55', category: 'Infectious Disease', name: 'Conjunctival Injection (Red Eyes)' },
  { id: 'id56', category: 'Infectious Disease', name: 'Purulent Eye Discharge' },
  { id: 'id57', category: 'Infectious Disease', name: 'Left Upper Quadrant Fullness/Pain (Splenomegaly)' },

  // OBG & Gynecology
  { id: 'o1', category: 'OBG & Gynec', name: 'Antenatal care/ANC' },
  { id: 'o11', category: 'OBG & Gynec', name: 'Postnatal care/PNC' },
  { id: 'o12', category: 'OBG & Gynec', name: 'Amenorrhea (Absence of Menses)' },
  { id: 'o2', category: 'OBG & Gynec', name: 'Dysmenorrhea (Painful Menses)' },
  { id: 'o3', category: 'OBG & Gynec', name: 'Menorrhagia (Heavy Bleeding)' },
  { id: 'o4', category: 'OBG & Gynec', name: 'Postmenopausal Bleeding' },
  { id: 'o5', category: 'OBG & Gynec', name: 'Abnormal Vaginal Discharge' },
  { id: 'o6', category: 'OBG & Gynec', name: 'Pelvic Pain / Lower Abdominal Pain' },
  { id: 'o7', category: 'OBG & Gynec', name: 'Dyspareunia' },
  { id: 'o8', category: 'OBG & Gynec', name: 'Labour Pain' },
  { id: 'o9', category: 'OBG & Gynec', name: 'Leaking P/V (Amniotic Fluid)' },
  { id: 'o10', category: 'OBG & Gynec', name: 'Decreased Fetal Movements' },
  { id: 'o13', category: 'OBG & Gynec', name: 'Mild anamia with 9-10 gm/dl' },
  { id: 'o14', category: 'OBG & Gynec', name: 'Moderate anamia with 7.8-9 gm/dl' },
  { id: 'o15', category: 'OBG & Gynec', name: 'Sever anamia with less than 7 gm/dl' },
  { id: 'o16', category: 'OBG & Gynec', name: 'Very sever anamia with less than 5 gm/dl' },
  { id: 'o17', category: 'OBG & Gynec', name: 'Metrorrhagia (Irregular Bleeding Between Periods)' },
  { id: 'o18', category: 'OBG & Gynec', name: 'Menometrorrhagia (Heavy & Irregular Bleeding)' },
  { id: 'o19', category: 'OBG & Gynec', name: 'Polymenorrhea (Cycles < 21 Days)' },
  { id: 'o20', category: 'OBG & Gynec', name: 'Oligomenorrhea (Cycles > 35 Days)' },
  { id: 'o21', category: 'OBG & Gynec', name: 'Mittelschmerz (Mid-cycle Ovulatory Pain)' },
  { id: 'o22', category: 'OBG & Gynec', name: 'Leukorrhea (Normal White Discharge)' },
  { id: 'o23', category: 'OBG & Gynec', name: 'Pruritus Vulvae (Severe Vulvar Itching)' },
  { id: 'o24', category: 'OBG & Gynec', name: 'Postcoital Bleeding (Bleeding After Intercourse)' },
  { id: 'o25', category: 'OBG & Gynec', name: 'Sensation of Lump/Dragging (Pelvic Organ Prolapse)' },
  { id: 'o26', category: 'OBG & Gynec', name: 'Urinary Incontinence (Stress/Urge)' },
  { id: 'o27', category: 'OBG & Gynec', name: 'Galactorrhea (Unprovoked Milk Discharge)' },
  { id: 'o28', category: 'OBG & Gynec', name: 'Hirsutism & Virilization (Excess Hair/Deep Voice)' },
  { id: 'o29', category: 'OBG & Gynec', name: 'Hyperemesis Gravidarum (Severe Nausea/Vomiting)' },
  { id: 'o30', category: 'OBG & Gynec', name: 'Bleeding in Early Pregnancy (Threatened Abortion)' },
  { id: 'o31', category: 'OBG & Gynec', name: 'Antepartum Hemorrhage / APH' },
  { id: 'o32', category: 'OBG & Gynec', name: 'Preeclamptic Symptoms (Headache/Visual Changes)' },
  { id: 'o33', category: 'OBG & Gynec', name: 'Pruritus Gravidarum (Itching in Pregnancy without Rash)' },

  // ENT
  { id: 'e1', category: 'ENT', name: 'Earache (Otalgia)' },
  { id: 'e2', category: 'ENT', name: 'Tinnitus' },
  { id: 'e3', category: 'ENT', name: 'Hearing Loss / Deafness' },
  { id: 'e4', category: 'ENT', name: 'Nasal Discharge / Rhinorrhea' },
  { id: 'e5', category: 'ENT', name: 'Epistaxis (Nosebleed)' },
  { id: 'e6', category: 'ENT', name: 'Sore Throat' },
  { id: 'e7', category: 'ENT', name: 'Dysphagia (Difficulty Swallowing)' },
  { id: 'e8', category: 'ENT', name: 'Hoarseness of Voice' },{ id: 'ent1', category: 'ENT', name: 'Otalgia (Earache)' },
  { id: 'ent2', category: 'ENT', name: 'Otorrhea (Ear Discharge)' },
  { id: 'ent3', category: 'ENT', name: 'Tinnitus (Ringing in Ears)' },
  { id: 'ent4', category: 'ENT', name: 'Hearing Loss (Conductive)' },
  { id: 'ent15', category: 'ENT', name: 'Hearing Loss (Sensorineural)' },
  { id: 'ent5', category: 'ENT', name: 'Vertigo / Dizziness' },
  { id: 'ent6', category: 'ENT', name: 'Rhinorrhea (Runny Nose)' },
  { id: 'ent7', category: 'ENT', name: 'Epistaxis (Nosebleed)' },
  { id: 'ent8', category: 'ENT', name: 'Anosmia / Hyposmia (Loss of Smell)' },
  { id: 'ent9', category: 'ENT', name: 'Nasal Obstruction / Congestion' },
  { id: 'ent10', category: 'ENT', name: 'Odynophagia (Painful Swallowing)' },
  { id: 'ent11', category: 'ENT', name: 'Dysphagia (Difficulty Swallowing)' },
  { id: 'ent12', category: 'ENT', name: 'Dysphonia / Hoarseness' },
  { id: 'ent13', category: 'ENT', name: 'Stridor (Noisy Breathing)' },
  { id: 'ent14', category: 'ENT', name: 'Globus Sensation (Lump in Throat)' },
// Dermatology
  { id: 'derm1', category: 'Dermatology', name: 'Pruritus (Itching)' },
  { id: 'derm2', category: 'Dermatology', name: 'Maculopapular rash' },
  { id: 'derm3', category: 'Dermatology', name: 'Erythema' },
  { id: 'derm4', category: 'Dermatology', name: 'Vesicular lesions' },
  { id: 'derm5', category: 'Dermatology', name: 'Skin peeling' },
  { id: 'derm6', category: 'Dermatology', name: 'Nodules' },
  { id: 'derm7', category: 'Dermatology', name: 'Macule / Patch (Flat discoloration)' },
  { id: 'derm8', category: 'Dermatology', name: 'Papule / Plaque (Raised solid lesion)' },
  { id: 'derm9', category: 'Dermatology', name: 'Bulla (Large fluid-filled blister)' },
  { id: 'derm10', category: 'Dermatology', name: 'Pustule (Pus-filled lesion)' },
  { id: 'derm11', category: 'Dermatology', name: 'Wheal / Urticaria (Hives)' },
  { id: 'derm12', category: 'Dermatology', name: 'Comedones (Blackheads/Whiteheads)' },
  { id: 'derm13', category: 'Dermatology', name: 'Burrow (Scabies tunnel)' },
  { id: 'derm14', category: 'Dermatology', name: 'Petechiae / Purpura (Non-blanching red spots)' },
  { id: 'derm15', category: 'Dermatology', name: 'Ecchymosis (Bruising)' },
  { id: 'derm16', category: 'Dermatology', name: 'Telangiectasia (Dilated capillaries)' },
  { id: 'derm17', category: 'Dermatology', name: 'Scale (Excess flaking skin)' },
  { id: 'derm18', category: 'Dermatology', name: 'Crust (Dried serum/blood/pus)' },
  { id: 'derm19', category: 'Dermatology', name: 'Excoriation (Scratch marks)' },
  { id: 'derm20', category: 'Dermatology', name: 'Fissure (Linear skin crack)' },
  { id: 'derm21', category: 'Dermatology', name: 'Ulcer / Erosion (Open sore)' },
  { id: 'derm22', category: 'Dermatology', name: 'Lichenification (Thickened skin from rubbing)' },
  { id: 'derm23', category: 'Dermatology', name: 'Dysesthesia (Abnormal skin sensation)' },
  { id: 'derm24', category: 'Dermatology', name: 'Hyperhidrosis (Excessive sweating)' },
  { id: 'derm25', category: 'Dermatology', name: 'Anhidrosis (Lack of sweating)' },
  { id: 'derm26', category: 'Dermatology', name: 'Alopecia (Hair loss)' },
  { id: 'derm27', category: 'Dermatology', name: 'Nail Dystrophy (Pitting/Clubbing/Onycholysis)' },
  // Oncology (Carcinoma)
  { id: 'onc1', category: 'Oncology', name: 'Palpable Hard Mass' },
  { id: 'onc2', category: 'Oncology', name: 'Night Sweats' },
  { id: 'onc3', category: 'Oncology', name: 'Persistent Unexplained Pain' },
  { id: 'onc4', category: 'Oncology', name: 'Change in Bowel / Bladder Habits' },
  { id: 'onc5', category: 'Oncology', name: 'Unexplained Bleeding / Discharge' },
  { id: 'onc6', category: 'Oncology', name: 'Thickening or Lump (Breast/Elsewhere)' },

  // Surgery
  { id: 's1', category: 'Surgery', name: 'Acute Abdomen / Guarding' },
  { id: 's2', category: 'Surgery', name: 'Rebound Tenderness' },
  { id: 's3', category: 'Surgery', name: 'Swelling / Hernia' },
  { id: 's4', category: 'Surgery', name: 'Non-healing Ulcer / Diabetic Foot' },
  { id: 's5', category: 'Surgery', name: 'Trauma / Laceration' },
  { id: 's6', category: 'Surgery', name: 'Hematemesis (Vomiting Blood)' },
  { id: 's7', category: 'Surgery', name: 'Melena (Black Tarry Stools)' },
  { id: 's8', category: 'Surgery', name: 'Intermittent Claudication' },
  { id: 's9', category: 'Surgery', name: 'Burns' },
  { id: 's61', category: 'Surgery', name: 'Dog Bite' },
  { id: 's62', category: 'Surgery', name: 'Snack Bite' },
  { id: 's63', category: 'Surgery', name: 'Something Bite' },

// Trauma
  { id: 's10', category: 'Trauma', name: 'Head Injury / Loss of Consciousness' },
  { id: 's11', category: 'Trauma', name: 'Scalp Laceration' },
  { id: 's12', category: 'Trauma', name: 'Battle\'s Sign / Raccoon Eyes' },
  { id: 's13', category: 'Trauma', name: 'CSF Rhinorrhea / Otorrhea' },
  { id: 's14', category: 'Trauma', name: 'Facial Bone Deformity' },
  { id: 's15', category: 'Trauma', name: 'Neck Swelling / Hematoma' },
  { id: 's16', category: 'Trauma', name: 'Penetrating Neck Injury' },
  { id: 's17', category: 'Trauma', name: 'Blunt Chest Trauma' },
  { id: 's18', category: 'Trauma', name: 'Penetrating Chest Wound' },
  { id: 's19', category: 'Trauma', name: 'Flail Chest / Paradoxical Movement' },
  { id: 's20', category: 'Trauma', name: 'Subcutaneous Emphysema' },
  { id: 's21', category: 'Trauma', name: 'Tracheal Deviation' },
  { id: 's22', category: 'Trauma', name: 'Muffled Heart Sounds' },
  { id: 's23', category: 'Trauma', name: 'Distended Neck Veins (Trauma)' },
  { id: 's24', category: 'Trauma', name: 'Rib Fracture Tenderness' },
  { id: 's25', category: 'Trauma', name: 'Blunt Abdominal Trauma' },
  { id: 's26', category: 'Trauma', name: 'Penetrating Abdominal Wound' },
  { id: 's27', category: 'Trauma', name: 'Abdominal Rigidity / Board-like Abdomen' },
  { id: 's28', category: 'Trauma', name: 'Seatbelt Sign / Ecchymosis' },
  { id: 's29', category: 'Trauma', name: 'Evisceration' },
  { id: 's30', category: 'Trauma', name: 'Grey Turner\'s / Cullen\'s Sign' },
  { id: 's31', category: 'Trauma', name: 'Back Pain (Post-Trauma)' },
  { id: 's32', category: 'Trauma', name: 'Spinal Tenderness / Step Deformity' },
  { id: 's33', category: 'Trauma', name: 'Loss of Sensation Below Injury Level' },
  { id: 's34', category: 'Trauma', name: 'Limb Weakness / Paralysis (Post-Trauma)' },
  { id: 's35', category: 'Trauma', name: 'Bladder / Bowel Incontinence (Post-Trauma)' },
  { id: 's36', category: 'Trauma', name: 'Priapism (Spinal Injury)' },
  { id: 's37', category: 'Trauma', name: 'Deformity / Angulation' },
  { id: 's38', category: 'Trauma', name: 'Open Fracture' },
  { id: 's39', category: 'Trauma', name: 'Closed Fracture / Swelling' },
  { id: 's40', category: 'Trauma', name: 'Joint Dislocation' },
  { id: 's41', category: 'Trauma', name: 'Absent / Diminished Distal Pulse' },
  { id: 's42', category: 'Trauma', name: 'Compartment Syndrome (Pain out of Proportion)' },
  { id: 's43', category: 'Trauma', name: 'Crush Injury' },
  { id: 's44', category: 'Trauma', name: 'Degloving Injury' },
  { id: 's45', category: 'Trauma', name: 'Amputation (Traumatic)' },
  { id: 's46', category: 'Trauma', name: 'Blood at Urethral Meatus' },
  { id: 's47', category: 'Trauma', name: 'Scrotal / Perineal Hematoma' },
  { id: 's48', category: 'Trauma', name: 'Gross Hematuria (Post-Trauma)' },
  { id: 's49', category: 'Trauma', name: 'Flank Ecchymosis / Renal Injury Signs' },
  { id: 's50', category: 'Trauma', name: 'Active Hemorrhage / Pulsatile Bleeding' },
  { id: 's51', category: 'Trauma', name: 'Expanding Hematoma' },
  { id: 's52', category: 'Trauma', name: 'Cold / Pale Extremity (Vascular Injury)' },
  { id: 's53', category: 'Trauma', name: 'Bruit / Thrill Over Vessel' },
  { id: 's54', category: 'Trauma', name: 'Abrasion' },
  { id: 's55', category: 'Trauma', name: 'Contusion / Bruise' },
  { id: 's56', category: 'Trauma', name: 'Puncture Wound' },
  { id: 's57', category: 'Trauma', name: 'Foreign Body (Retained)' },
  { id: 's58', category: 'Trauma', name: 'Bite Wound (Animal/Human)' },
  { id: 's59', category: 'Trauma', name: 'Chemical Burn' },
  { id: 's60', category: 'Trauma', name: 'Electrical Burn' },

  // Hematology (Blood System)
  { id: 'h1', category: 'Hematology', name: 'Severe Pallor (Anemia)' },
  { id: 'h2', category: 'Hematology', name: 'Easy Bruising / Ecchymosis' },
  { id: 'h3', category: 'Hematology', name: 'Petechiae / Purpura' },
  { id: 'h4', category: 'Hematology', name: 'Generalized Lymphadenopathy' },
  { id: 'h5', category: 'Hematology', name: 'Bleeding Gums' },
  { id: 'h6', category: 'Hematology', name: 'Recurrent Infections' },

  // Gastroenterology
  { id: 'gi1', category: 'Gastroenterology', name: 'Epigastric Pain / Heartburn' },
  { id: 'gi2', category: 'Gastroenterology', name: 'Nausea / Vomiting' },
  { id: 'gi3', category: 'Gastroenterology', name: 'Diarrhea' },
  { id: 'gi4', category: 'Gastroenterology', name: 'Constipation' },
  { id: 'gi5', category: 'Gastroenterology', name: 'Tenesmus' },

  // Neurology
  { id: 'n1', category: 'Neurology', name: 'Headache' },
  { id: 'n2', category: 'Neurology', name: 'Seizures / Convulsions' },
  { id: 'n3', category: 'Neurology', name: 'Dizziness' },
  { id: 'n4', category: 'Neurology', name: 'Altered Sensorium / Confusion' },
  { id: 'n5', category: 'Neurology', name: 'Numbness / Tingling (Paresthesia)' },
  { id: 'n6', category: 'Neurology', name: 'Tremors' },
  { id: 'n7', category: 'Neurology', name: 'Focal Motor Weakness (Hemiparesis)' },
  { id: 'n8', category: 'Neurology', name: 'Vertigo' },
  { id: 'n9', category: 'Neurology', name: 'Neck Rigidity' },


  // Cardiology & Respiratory
  { id: 'c1', category: 'Cardio-Respiratory', name: 'Chest Pain / Angina' },
  { id: 'c2', category: 'Cardio-Respiratory', name: 'Palpitations' },
  { id: 'c3', category: 'Cardio-Respiratory', name: 'Orthopnea / PND' },
  { id: 'c4', category: 'Cardio-Respiratory', name: 'Cough (Productive)' },
  { id: 'c5', category: 'Cardio-Respiratory', name: 'Dyspnea / Breathlessness' },
  { id: 'c6', category: 'Cardio-Respiratory', name: 'Hemoptysis' },
  { id: 'c7', category: 'Cardio-Respiratory', name: 'Wheezing' },
  { id: 'c8', category: 'Cardio-Respiratory', name: 'Chest Pressure' },
  { id: 'c9', category: 'Cardio-Respiratory', name: 'Chest Tightness' },
  { id: 'c10', category: 'Cardio-Respiratory', name: 'Exertional Dyspnea' },
  { id: 'c11', category: 'Cardio-Respiratory', name: 'Paroxysmal Nocturnal Dyspnea' },
  { id: 'c12', category: 'Cardio-Respiratory', name: 'Syncope' },
  { id: 'c13', category: 'Cardio-Respiratory', name: 'Presyncope' },
  { id: 'c14', category: 'Cardio-Respiratory', name: 'Dizziness' },
  { id: 'c15', category: 'Cardio-Respiratory', name: 'Lightheadedness' },
  { id: 'c16', category: 'Cardio-Respiratory', name: 'Fatigue' },
  { id: 'c17', category: 'Cardio-Respiratory', name: 'Weakness' },
  { id: 'c18', category: 'Cardio-Respiratory', name: 'Peripheral Edema' },
  { id: 'c19', category: 'Cardio-Respiratory', name: 'Abdominal Swelling (Ascites)' },
  { id: 'c20', category: 'Cardio-Respiratory', name: 'Cyanosis' },
  { id: 'c21', category: 'Cardio-Respiratory', name: 'Claudication' },
  { id: 'c22', category: 'Cardio-Respiratory', name: 'Nocturia' },
  { id: 'c23', category: 'Cardio-Respiratory', name: 'Diaphoresis' },
  { id: 'c24', category: 'Cardio-Respiratory', name: 'Nausea' },
  { id: 'c25', category: 'Cardio-Respiratory', name: 'Anorexia' },
  { id: 'c26', category: 'Cardio-Respiratory', name: 'Early Satiety' },
  { id: 'c27', category: 'Cardio-Respiratory', name: 'Right Upper Quadrant Abdominal Pain' },
  { id: 'c28', category: 'Cardio-Respiratory', name: 'Cardiac Cachexia' },
  { id: 'c29', category: 'Cardio-Respiratory', name: 'Hoarseness' },
  { id: 'c30', category: 'Cardio-Respiratory', name: 'Dry Cough' },
  { id: 'c31', category: 'Cardio-Respiratory', name: 'Sputum Production (Expectoration)' },
  { id: 'c32', category: 'Cardio-Respiratory', name: 'Platypnea' },
  { id: 'c33', category: 'Cardio-Respiratory', name: 'Trepopnea' },
  { id: 'c34', category: 'Cardio-Respiratory', name: 'Tachypnea' },
  { id: 'c35', category: 'Cardio-Respiratory', name: 'Bradypnea' },
  { id: 'c36', category: 'Cardio-Respiratory', name: 'Apnea' },
  { id: 'c37', category: 'Cardio-Respiratory', name: 'Stridor' },
  { id: 'c38', category: 'Cardio-Respiratory', name: 'Pleuritic Chest Pain' },
  { id: 'c39', category: 'Cardio-Respiratory', name: 'Chest Heaviness' },
  { id: 'c40', category: 'Cardio-Respiratory', name: 'Hypoxia-Related Confusion or Restlessness' },
  { id: 'c41', category: 'Cardio-Respiratory', name: 'Use of Accessory Muscles of Respiration' },
  { id: 'c42', category: 'Cardio-Respiratory', name: 'Nasal Flaring' },
  { id: 'c43', category: 'Cardio-Respiratory', name: 'Grunting' },
  { id: 'c44', category: 'Cardio-Respiratory', name: 'Hyperventilation' },
  { id: 'c45', category: 'Cardio-Respiratory', name: 'Hypoventilation' },
  { id: 'c46', category: 'Cardio-Respiratory', name: 'Snoring' },
  { id: 'c47', category: 'Cardio-Respiratory', name: 'Daytime Somnolence' },
  { id: 'c48', category: 'Cardio-Respiratory', name: 'Choking Sensation' },
  { id: 'c49', category: 'Cardio-Respiratory', name: 'Rhinorrhea (Runny Nose)' },
  { id: 'c50', category: 'Cardio-Respiratory', name: 'Nasal Congestion' },
  { id: 'c51', category: 'Cardio-Respiratory', name: 'Sneezing' },
  { id: 'c52', category: 'Cardio-Respiratory', name: 'Epistaxis (Nosebleed)' },
  { id: 'c53', category: 'Cardio-Respiratory', name: 'Anosmia (Loss of Smell)' },
  { id: 'c54', category: 'Cardio-Respiratory', name: 'Hyposmia (Decreased Smell)' },
  { id: 'c55', category: 'Cardio-Respiratory', name: 'Postnasal Drip' },
  { id: 'c56', category: 'Cardio-Respiratory', name: 'Sore Throat (Pharyngitis)' },
  { id: 'c57', category: 'Cardio-Respiratory', name: 'Throat Clearing' },
  { id: 'c58', category: 'Cardio-Respiratory', name: 'Digital Clubbing' },

  // Others (Endocrine, Urinary, Pediatrics, Ophthalmology, Psychiatry)
  { id: 'en1', category: 'Endocrine', name: 'Polyuria' },
  { id: 'en2', category: 'Endocrine', name: 'Polydipsia' },
  { id: 'en3', category: 'Endocrine', name: 'Heat Intolerance' },
  { id: 'en4', category: 'Endocrine', name: 'Cold Intolerance' },
  { id: 'u1', category: 'Urinary', name: 'Dysuria' },
  { id: 'u2', category: 'Urinary', name: 'Hematuria' },
  { id: 'u3', category: 'Urinary', name: 'Flank Pain' },
  { id: 'u4', category: 'Urinary', name: 'Urinary Frequency (Pollakiuria)' },
  { id: 'u5', category: 'Urinary', name: 'Urinary Urgency (Sudden intense urge)' },
  { id: 'u6', category: 'Urinary', name: 'Nocturia (Nighttime Urination)' },
  { id: 'u7', category: 'Urinary', name: 'Urinary Retention (Inability to empty bladder)' },
  { id: 'u8', category: 'Urinary', name: 'Urinary Incontinence (Leakage of urine)' },
  { id: 'u9', category: 'Urinary', name: 'Oliguria / Anuria (Decreased or absent urine)' },
  { id: 'u10', category: 'Urinary', name: 'Hesitancy / Poor Stream' },
  { id: 'u11', category: 'Urinary', name: 'Testicular Pain / Scrotal Swelling' },
  { id: 'u12', category: 'Urinary', name: 'Pelvic / Perineal Pain' },
  { id: 'u13', category: 'Urinary', name: 'Pneumaturia / Fecaluria' },

  { id: 'p1', category: 'Pediatrics', name: 'Poor Feeding' },
  { id: 'p2', category: 'Pediatrics', name: 'Excessive Crying / Irritability' },
  { id: 'p3', category: 'Pediatrics', name: 'Delayed Milestones' },
  { id: 'p4', category: 'Pediatrics', name: 'Newborn care/Neonatal care' },
  { id: 'p5', category: 'Pediatrics', name: 'Failure to Thrive (Poor weight gain)' },
  { id: 'p6', category: 'Pediatrics', name: 'Lethargy / Decreased Responsiveness' },
  { id: 'p7', category: 'Pediatrics', name: 'Respiratory Distress (Grunting / Nasal Flaring)' },
  { id: 'p8', category: 'Pediatrics', name: 'Hypotonia (Floppy Baby)' },
  { id: 'p9', category: 'Pediatrics', name: 'Febrile Seizures / Convulsions' },
  { id: 'p10', category: 'Pediatrics', name: 'Vomiting / Regurgitation in Infant' },
  { id: 'p11', category: 'Pediatrics', name: 'Nocturnal Enuresis (Bedwetting)' },
  { id: 'p12', category: 'Pediatrics', name: 'Pediatric Rash / Exanthem' },
  { id: 'p13', category: 'Pediatrics', name: 'Neonatal Icterus (Jaundice in Newborn)' },
  { id: 'p14', category: 'Pediatrics', name: 'Stridor / Croupy Cough' },
  { id: 'op1', category: 'Ophthalmology', name: 'Blurred Vision' },
  { id: 'op2', category: 'Ophthalmology', name: 'Red Eye' },
  { id: 'op3', category: 'Ophthalmology', name: 'Photophobia' },
  { id: 'op4', category: 'Ophthalmology', name: 'Painless Vision Loss' },
  { id: 'op5', category: 'Ophthalmology', name: 'Painful Vision Loss' },
  { id: 'op6', category: 'Ophthalmology', name: 'Amaurosis Fugax (Transient Vision Loss)' },
  { id: 'op7', category: 'Ophthalmology', name: 'Visual Field Defects (Scotoma/Hemianopia)' },
  { id: 'op8', category: 'Ophthalmology', name: 'Diplopia (Double Vision)' },
  { id: 'op9', category: 'Ophthalmology', name: 'Photopsia (Flashes of Light)' },
  { id: 'op10', category: 'Ophthalmology', name: 'Floaters' },
  { id: 'op11', category: 'Ophthalmology', name: 'Nyctalopia (Night Blindness)' },
  { id: 'op12', category: 'Ophthalmology', name: 'Epiphora (Excessive Tearing)' },
  { id: 'op13', category: 'Ophthalmology', name: 'Foreign Body Sensation / Grittiness' },
  { id: 'op14', category: 'Ophthalmology', name: 'Asthenopia (Eye Strain / Fatigue)' },
  { id: 'op15', category: 'Ophthalmology', name: 'Ptosis (Drooping Eyelid)' },
  { id: 'op16', category: 'Ophthalmology', name: 'Proptosis / Exophthalmos (Bulging Eye)' },
  // Psychiatry
  { id: 'psy1', category: 'Psychiatry', name: 'Depressed Mood / Sadness' },
  { id: 'psy2', category: 'Psychiatry', name: 'Anhedonia (Loss of Interest/Pleasure)' },
  { id: 'psy3', category: 'Psychiatry', name: 'Mania / Hypomania (Elevated Mood)' },
  { id: 'psy4', category: 'Psychiatry', name: 'Emotional Lability (Rapid Mood Swings)' },
  { id: 'psy5', category: 'Psychiatry', name: 'Hallucinations (Auditory/Visual)' },
  { id: 'psy6', category: 'Psychiatry', name: 'Delusions (Fixed False Beliefs)' },
  { id: 'psy7', category: 'Psychiatry', name: 'Disorganized Speech / Thought' },
  { id: 'psy8', category: 'Psychiatry', name: 'Panic Attacks' },
  { id: 'psy9', category: 'Psychiatry', name: 'Obsessions and Compulsions' },
  { id: 'psy10', category: 'Psychiatry', name: 'Severe Insomnia / Sleep Disturbances' },
  { id: 'psy11', category: 'Psychiatry', name: 'Catatonia' },

];

const CATEGORIES = [
  'All',
  'General Medicine',
  'Infectious Disease',
  'OBG & Gynec',
  'ENT',
  'Dermatology',
  'Oncology',
  'Surgery',
  'Trauma',
  'Hematology',
  'Gastroenterology',
  'Neurology',
  'Cardio-Respiratory',
  'Endocrine',
  'Urinary',
  'Pediatrics',
  'Ophthalmology',
  'Psychiatry',
];


const ROLE_TABS = {
  admin: ['reception', 'nursing', 'doctor',  'ipd', 'lab', 'review', 'pharmacy', 'settings'],
  reception: ['reception'],
  nursing: ['nursing'],
  nurse: ['nursing'],
  doctor: ['doctor'],
  ipd: ['ipd'],
  lab: ['lab'],
  pharmacy: ['pharmacy'],
};
export default function MedFlowApp() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState(null); // { role, fullName, hospitalId, hospitalName, tabs }
  const [authLoading, setAuthLoading] = useState(true);

// Exam & Investigation Suggestion State
  const [aiExamLoading, setAiExamLoading] = useState(false);
  const [aiExamError, setAiExamError] = useState('');
  const [examSuggestions, setExamSuggestions] = useState(null);
  const [selectedNegativeHistory, setSelectedNegativeHistory] = useState([]);
  const [selectedInvestigations, setSelectedInvestigations] = useState([]);
  const [examValues, setExamValues] = useState({});
  const [manualInvestigation, setManualInvestigation] = useState('');

  const [hospitalInfo, setHospitalInfo] = useState({
    name: "Community Health center,Dhunsol",
    address: "dhunsol, agathala highway, lakhani, State gujarat - 385360",
    doctorName: "Dr. Ramesh Tantiya, MBBS",
    contact: "+91 93276 81907",
    email: "abcd@gmail.com",
    doctorSign: "/sign.png",
  });

  const updateHospitalInfo = (field, value) => {
    setHospitalInfo(prev => ({ ...prev, [field]: value }));
  };

  // Hospital settings ne Supabase mathi load karo (page load / hospital badle tyare)
  useEffect(() => {
    if (!currentRole?.hospitalId) return;
    supabase.from('hospital_settings').select('*') .eq('hospital_id', currentRole.hospitalId).maybeSingle()
        .then(({ data }) => {
          if (data) {
            setHospitalInfo({
              name: data.name || '',
              address: data.address || '',
              doctorName: data.doctor_name || '',
              contact: data.contact || '',
              email: data.email || '',
              doctorSign: data.doctor_sign || '',
            });
          }
        });
  }, [currentRole?.hospitalId]);

  const saveHospitalSettings = async () => {
    if (!currentRole?.hospitalId) { alert('Hospital not identified yet.'); return; }
    const { error } = await supabase.from('hospital_settings').upsert({
      hospital_id: currentRole.hospitalId,
      name: hospitalInfo.name,
      address: hospitalInfo.address,
      doctor_name: hospitalInfo.doctorName,
      contact: hospitalInfo.contact,
      email: hospitalInfo.email,
      doctor_sign: hospitalInfo.doctorSign,
    });
    if (error) alert('Could not save settings: ' + error.message);
    else alert('Settings saved successfully.');
  };

  const runExamSuggestionEngine = async () => {
    if (selectedSymptoms.length === 0 && !manualHistory) return;
    setAiExamLoading(true);
    setAiExamError('');
    setExamSuggestions(null);

    const symNames = selectedSymptoms.map(s => {
      const d = symptomDurations[s.id];
      return d && d.num ? `${s.name} (x ${d.num} ${d.unit})` : s.name;
    }).join(', ');

    const examPromptText = `
const examPromptText = \`
You are a multi-disciplinary panel of senior consultants — General Medicine, Cardiology, Nephrology, Rhematology, Respiratory Meicine, Oncology , General Surgery, Obstetrics & Gynecology, Pediatrics, Orthopedics, ENT, Dermatology, Psychiatry, and Emergency Medicine — reasoning together as a single expert AI. Apply whichever specialty the presenting complaint and symptoms actually belong to, at full specialist depth — do not default to general medicine reasoning for an OBG, surgical, pediatric, or psychiatric case. For obstetric/gynecological presentations specifically, reason to the standard of Williams Obstetrics, Dutta's Textbook of Obstetrics, and Shaw's Textbook of Gynecology (gravida/para status, gestational age, obstetric red flags, standard antenatal/intrapartum/postnatal workups). Based on the patient data below, suggest relevant clinical documentation to help the doctor complete a thorough workup.

Patient Profile: ${activePatient?.age}, ${activePatient?.gender}, ${activePatient?.occupation}.
Chief Complaint: ${activePatient?.complaint}.
Selected Clinical Findings & Symptoms: ${symNames || 'None selected'}.
Doctor's Manual History: ${manualHistory || 'Not provided'}.

Suggest:
1. "negativeHistory" - relevant negative history points a doctor should ask/document to rule out differentials (e.g. "Denies hemoptysis", "No history of trauma").
2. "investigations" - standard relevant investigations to order for this presentation.
3. "generalExamination" - relevant general examination parameters to check, each with its normal reference value/range.
4. "systemicExamination" - relevant systemic examination parameters to check, each with its normal reference value/range.

Return 4-8 items per category, kept concise and clinically relevant to the case above.

You MUST return your response as a valid JSON object matching exactly this schema (no markdown ticks):
{
  "negativeHistory": ["...", "..."],
  "investigations": ["...", "..."],
  "generalExamination": [{"name": "Pallor", "normalRange": "Absent"}],
  "systemicExamination": [{"name": "CVS - S1S2", "normalRange": "Normal, no murmurs"}]
}
`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':  'Bearer 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'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: 'You are an expert clinical assistant. Always respond with valid JSON only.' },
            { role: 'user', content: examPromptText }
          ],
        }),
      });

      if (!response.ok) {
        setAiExamError(`Server error: ${response.status} ${response.statusText}`);
        setAiExamLoading(false);
        return;
      }

      const data = await response.json();
      const resultText = data.choices?.[0]?.message?.content;

      if (resultText) {
        const parsed = JSON.parse(resultText);
        setExamSuggestions(parsed);
      } else {
        setAiExamError('AI Engine returned an empty response.');
      }
    } catch (error) {
      console.error("Grok API Error:", error);
      setAiExamError('Failed to fetch exam suggestions. Please try again.');
    } finally {
      setAiExamLoading(false);
    }
  };

// Helper toggles for negative history / investigations (checkbox-style selection)
  const toggleNegativeHistory = (item) => {
    setSelectedNegativeHistory(prev =>
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleInvestigation = (item) => {
    setSelectedInvestigations(prev =>
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const addManualInvestigation = () => {
    const val = manualInvestigation.trim();
    if (!val) return;
    if (!selectedInvestigations.includes(val)) {
      setSelectedInvestigations(prev => [...prev, val]);
    }
    setManualInvestigation('');
  };

  const removeInvestigation = (item) => {
    setSelectedInvestigations(prev => prev.filter(i => i !== item));
  };

  const setExamValue = (name, value) => {
    setExamValues(prev => ({ ...prev, [name]: value }));
  };
  const buildFinalExamValues = () => {
    const final = { ...examValues };
    (examSuggestions?.generalExamination || []).forEach(param => {
      if (!final[param.name] || !final[param.name].trim()) {
        final[param.name] = param.normalRange || 'Normal';
      }
    });
    (examSuggestions?.systemicExamination || []).forEach(param => {
      if (!final[param.name] || !final[param.name].trim()) {
        final[param.name] = param.normalRange || 'Normal';
      }
    });
    return final;
  };

  const LAB_TEST_PARAMS = {
    "Complete Blood Count (CBC)": [
      { name: "Hemoglobin (Hb)", ref: "12-16 g/dL (F), 13-17 g/dL (M)" },
      { name: "WBC Count", ref: "4000-11000 /µL" },
      { name: "Neutrophiles Count", ref: "2500-7000 /µL or 40%-60%" },
      { name: "Lymphocytes Count", ref: "1000-4800 /µL or 20%-40%" },
      { name: "Monocytes Count", ref: "200-800 /µL or 2%-8%" },
      { name: "Eosinophils Count", ref: "<500 /µL or 1%-4%" },
      { name: "Basophiles Count", ref: "<300-7000 /µL or 0.5%-1%" },
      { name: "Platelet Count", ref: "1.5-4.5 lakh/µL" },
      { name: "MPV", ref: "7-9 fL" },
      { name: "RBC Count", ref: "4.5-5.5 million/µL" },
      { name: "MCV", ref: "80-100 fL" },
      { name: "MCH", ref: "27-31 pg/cell" },
      { name: "MCHC", ref: "32-36 g/dL" },
      { name: "RDW", ref: "11.5%-15.00 %" },
      { name: "Hematocrit (PCV)", ref: "36-46%" },
    ],
    "Blood Culture": [
      { name: "Culture Result", ref: "No growth" },
      { name: "Organism Identified", ref: "N/A" },
    ],
    "Erythrocyte Sedimentation Rate (ESR)": [
      { name: "ESR", ref: "0-20 mm/hr" },
    ],
    "Liver Function Test (LFT)": [
      { name: "SGOT (AST)", ref: "5-40 U/L" },
      { name: "SGPT (ALT)", ref: "7-56 U/L" },
      { name: "Bilirubin (Total)", ref: "0.3-1.2 mg/dL" },
    ],
    "Renal Function Test (RFT)": [
      { name: "Blood Urea", ref: "7-20 mg/dL" },
      { name: "Serum Creatinine", ref: "0.6-1.2 mg/dL" },
    ],
    "Random Blood Sugar": [
      { name: "RBS", ref: "70-140 mg/dL" },
    ],
  "Cogulation profile": [
    { name: "PT", ref: "11-13.5 sec" },
    { name: "INR", ref: "0.8-1.1 sec" },
    { name: "aPTT", ref: "30-40 sec" },
    { name: "Fibrinogen", ref: "200-400mg/dL" },
    { name: "D-Dimer", ref: "<0.5 mcg/mL" },
  ],
  };

  const TEST_CATEGORY_KEYWORDS = {
    Radiology: [
      'x-ray', 'xray', 'x ray', 'radiograph', 'radiography', 'cxr', 'axr', 'kud', 'kub',
      'usg', 'ultrasound', 'ultrasonography', 'sonography', 'sono', 'doppler', 'anomaly scan',
      'nt scan', 'nuchal translucency', 'tvs', 'tas',
      'ct', 'ct scan', 'hrct', 'cect', 'ncct', 'ct angio', 'ct angiography',
      'mri', 'mra', 'mrv', 'mrcp',
      'echo', '2d echo', 'echocardiography', 'echocardiogram',
      'ecg', 'ekg', 'tmt', 'treadmill', 'holter', 'eeg', 'emg', 'ncv', 'nerve conduction',
      'mammography', 'mammogram', 'dexa', 'bmd', 'bone density',
      'fluoroscopy', 'barium', 'barium swallow', 'barium meal',
      'pft', 'spirometry', 'pulmonary function',
      'chest pa', 'pa view', 'ap view', 'lateral view',
      'angiography', 'angiogram', 'venogram', 'venography',
      'scan', 'imaging', 'radiology',
    ],

    Microbiology: [
      'culture', 'sensitivity', 'c/s', 'c&s', 'gram stain', 'afb', 'zn stain',
      'cbnaat', 'gene xpert', 'genexpert', 'truenat', 'nat test',
      'widal', 'malaria', 'mp', 'smear for mp', 'peripheral smear for mp',
      'dengue', 'ns1', 'dengue igm', 'dengue igg', 'chikungunya', 'typhidot',
      'covid', 'rt-pcr', 'rtpcr', 'rapid antigen', 'rat', 'covid antigen',
      'stool routine', 'stool examination', 'stool r/m', 'stool r m', 'stool occult',
      'stool microscopy', 'stool ova', 'ova and cyst', 'ova cyst',
      'urine culture', 'blood culture', 'sputum', 'sputum culture', 'sputum afb',
      'pus culture', 'wound swab', 'swab', 'throat swab', 'nasal swab',
      'vdrl', 'rpr', 'tpha', 'hbsag', 'hcv', 'hiv', 'elisa', 'torch',
      'kit test', 'antigen test', 'antibody test', 'serology',
    ],

    Biochemistry: [
      'lft', 'liver function', 'bilirubin', 'sgot', 'ast', 'sgpt', 'alt',
      'alkaline phosphatase', 'alp', 'total protein', 'serum protein', 'albumin', 'globulin',
      'rft', 'kft', 'renal function', 'kidney function', 'serum creatinine', 'creatinine',
      'blood urea', 'urea', 'bun', 'uric acid',
      'blood sugar', 'rbs', 'fbs', 'ppbs', 'pp2bs', 'ogtt', 'hba1c', 'glycated hemoglobin',
      'glucose', 'random blood sugar', 'fasting blood sugar',
      'lipid profile', 'lipid', 'cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl',
      'electrolyte', 'serum electrolytes', 'sodium', 'potassium', 'chloride',
      'calcium', 'serum calcium', 'phosphorus', 'magnesium',
      'crp', 'c-reactive protein', 'hs-crp', 'procalcitonin', 'ferritin', 'serum ferritin',
      'troponin', 'trop-i', 'trop-t', 'ck-mb', 'cpk', 'd-dimer', 'bnp', 'nt-probnp',
      'amylase', 'lipase', 'ldh', 'serum iron', 'iron studies', 'tibc',
      'vitamin b12', 'vit b12', 'vitamin d', 'vit d', '25-oh vitamin d',
      'tsh', 't3', 't4', 'ft3', 'ft4', 'thyroid profile', 'thyroid function',
      'beta hcg', 'b-hcg', 'bhcg', 'psa', 'metabolic panel', 'basic metabolic',
      'comprehensive metabolic', 'ammonia', 'lactate', 'abg', 'arterial blood gas',
    ],

    Pathology: [
      'cbc', 'complete blood count', 'hemogram', 'cbc with esr', 'esr',
      'erythrocyte sedimentation', 'hemoglobin', 'hb ', 'hb%', 'blood count',
      'platelet', 'tlc', 'total leukocyte', 'dlc', 'differential leukocyte',
      'aec', 'absolute eosinophil', 'reticulocyte',
      'pcv', 'hematocrit', 'mcv', 'mch', 'mchc', 'rdw',
      'peripheral smear', 'ps for study', 'ps for mp', 'blood smear', 'bone marrow',
      'coagulation', 'pt ', 'pt-inr', 'inr', 'aptt', 'ptt', 'bleeding time',
      'clotting time', 'bt ', 'ct ', 'fibrinogen', 'coagulation profile',
      'urine routine', 'urine r/m', 'urine r m', 'urine complete', 'urine microscopy',
      'urine analysis', 'urinalysis',
      'biopsy', 'histopathology', 'hpe', 'cytology', 'fnac',
      'pap smear', 'fluid analysis', 'csf routine', 'csf analysis',
      'pleural fluid', 'ascitic fluid', 'synovial fluid',
    ]
  };


  const getTestCategory = (testName) => {
    const lower = (testName || '').toLowerCase();
    for (const [category, keywords] of Object.entries(TEST_CATEGORY_KEYWORDS)) {
      const matched = keywords.some(kw => {
        // Multi-word keywords (jema space hoy) ne simple substring thi j check karo
        if (kw.includes(' ') || kw.includes('-') || kw.includes('/')) {
          return lower.includes(kw);
        }
        // Single-word keywords ne WORD BOUNDARY thi check karo, jethi
        // "electrolytes" ma "ct" jevu false match na thay
        const re = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return re.test(lower);
      });
      if (matched) return category;
    }
    return 'Other';
  };

  const getTestParams = (testName) => {
    const found = Object.keys(LAB_TEST_PARAMS).find(key =>
        testName.toLowerCase().includes(key.toLowerCase().split(' (')[0].toLowerCase())
    );
    return found ? LAB_TEST_PARAMS[found] : [{ name: testName, ref: "" }];
  };

  const collectTestResults = (patientId, testEntries) => {
    return testEntries.map(({ inv, idx }) => {
      const params = getTestParams(inv);
      const paramResults = params.map((param, pIdx) => {
        const valEl = document.getElementById(`lab-val-${patientId}-${idx}-${pIdx}`);
        const refEl = document.getElementById(`lab-ref-${patientId}-${idx}-${pIdx}`);
        const val = valEl ? valEl.value : '';
        const ref = refEl ? refEl.value : '';
        return `${param.name}: ${val || 'N/A'} (Ref: ${ref || 'N/A'})`;
      }).join(', ');
      return `${inv} [${paramResults}]`;
    }).join('; ');
  };


  const sendLabSection = (patient, section) => {
    const invList = patient.investigationsOrdered && patient.investigationsOrdered.length > 0 ? patient.investigationsOrdered : ['General Test'];
    const completed = patient.completedTests || [];
    const entries = invList
        .map((inv, idx) => ({ inv, idx }))
        .filter(({ inv }) => (section === 'radiology' ? getTestCategory(inv) === 'Radiology' : getTestCategory(inv) !== 'Radiology'))
        .filter(({ inv }) => !completed.includes(inv)); // sirf je test na thayela hoy e j moklo
    if (entries.length === 0) return;

    const combined = collectTestResults(patient.id, entries);
    const images = section === 'radiology' ? (radiologyImages[patient.id] || []) : [];
    const sectionLabel = section === 'radiology' ? 'RADIOLOGY' : 'DIAGNOSTIC LAB (Path/Micro/Biochem)';

    const appended = `${sectionLabel}: ${combined}`;
    const newResults = patient.labResults ? `${patient.labResults}; ${appended}` : appended;
    const newCompletedTests = Array.from(new Set([...completed, ...entries.map(e => e.inv)]));
    const allDone = invList.every(inv => newCompletedTests.includes(inv));
    const newLabImages = section === 'radiology' ? [...(patient.labImages || []), ...images] : (patient.labImages || []);
    const newStatus = allDone ? (patient.status === 'IPD' ? 'IPD' : 'Doctor') : patient.status;
    const newLabStatus = allDone ? 'Completed' : 'Pending';

    setPatients(prev => prev.map(p => {
      if (p.id !== patient.id) return p;
      return { ...p, labResults: newResults, labImages: newLabImages, completedTests: newCompletedTests, status: newStatus, labStatus: newLabStatus };
    }));

    updatePatientInDb(patient.dbId, {
      lab_results: newResults,
      completed_tests: newCompletedTests,
      status: newStatus,
      lab_status: newLabStatus,
    });

    if (section === 'radiology') {
      setRadiologyImages(prev => {
        const next = { ...prev };
        delete next[patient.id];
        return next;
      });
    }
  };


  const IV_KEYWORDS = ['inj.', 'inj ', 'injection', ' iv ', 'i.v.', 'intravenous', 'infusion', 'drip', 'iv fluid', 'ivf', 'blood transfusion',

    // Surgical & Major Procedures
    'surgery', 'surgical', 'operation', 'ot', 'suturing', 'stitch', 'incision', 'drainage', 'biopsy', 'excise', 'excision',

    // OBGYN & Delivery
    'delivery', 'lscs', 'c-section', 'caesar', 'abortion', 'mvr', 'dilation', 'curettage', 'd&c', 'episiotomy',

    // Orthopedics
    'fracture', 'reduction', 'plaster', 'pop', 'slab', 'casting', 'nailing', 'plating', 'implant', 'arthroscopy', 'joint replacement',

    // Ophthalmology & ENT
    'cataract', 'iols', 'lasik', 'glaucoma surgery', 'tympanoplasty', 'septoplasty', 'tonsillectomy', 'mastoidectomy', 'fess', 'foreign body removal',

    // General IPD Triggers / Monitoring
    'admission', 'ipd', 'observation', 'catheter', 'rt insertion', 'ryle\'s tube', 'icustay', 'icu'
  ];

  const requiresIVAdmission = (meds = [], procedures = []) => {
    const medsFlag = meds.some(m => {
      const text = `${m.name} ${m.note || ''} ${m.dosage || ''}`.toLowerCase();
      return IV_KEYWORDS.some(kw => text.includes(kw));
    });
    const procFlag = procedures.some(pr => {
      const text = `${pr.text || pr.name || ''}`.toLowerCase();
      return IV_KEYWORDS.some(kw => text.includes(kw));
    });
    return medsFlag || procFlag;
  };

  const matchesSearch = (patient, query) => {
    if (!query || !query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (patient.name || '').toLowerCase().includes(q) ||
        (patient.uhid || '').toLowerCase().includes(q);
  };
  const [ipdPrinted, setIpdPrinted] = useState({});

  const printIpdCasePaper = (patient) => {
    const daysHtml = (patient.dailyOrders || []).map(day => {
      const vitalsLogStr = (day.vitalsLog || []).length > 0
          ? (day.vitalsLog || []).map(v => `${v.time}: BP ${v.bp}, Pulse ${v.pulse}, Temp ${v.temp}, SpO2 ${v.spo2}`).join('<br/>')
          : 'Not recorded';
      return `
    <div style="margin-bottom:16px;">
      <h4 style="background:#f3f4f6; padding:6px 10px; margin:0 0 6px 0;">${day.label}${day.date ? ` (${day.date})` : ''}</h4>
      <p style="font-size:13px;"><b>Vitals:</b><br/>${vitalsLogStr}</p>
      <p style="font-size:13px;"><b>Medications:</b> ${(day.meds || []).map(m => `${m.name} (${m.dosage}, ${m.duration})`).join('; ') || 'None'}</p>
      <p style="font-size:13px;"><b>Advice:</b> ${(day.advice || []).map(a => a.text).join('; ') || 'None'}</p>
      <p style="font-size:13px;"><b>Procedures:</b> ${(day.procedures || []).map(pr => pr.text).join('; ') || 'None'}</p>
    </div>
  `;
    }).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
    <html><head><title>IPD Case Paper - ${patient.name}</title></head>
    <body style="font-family: Arial, sans-serif; padding: 30px;">
      <div style="text-align:center; border-bottom:2px solid #333; padding-bottom:10px; margin-bottom:20px;">
        <h2 style="margin:0;">${hospitalInfo.name}</h2>
        <p style="margin:2px 0; font-size:13px;">${hospitalInfo.address}</p>
      </div>
      <p><b>Patient:</b> ${patient.name} | <b>UHID:</b> ${patient.uhid} | <b>Age/Sex:</b> ${patient.age}/${patient.gender}</p>
      <p><b>Diagnosis:</b> ${(patient.diagnoses || []).join(', ')}</p>
       <p><b>Lab Results:</b> ${patient.labResults || 'Pending / None'}</p>
      <hr/><h3>IPD Day-wise Orders</h3>
      ${daysHtml || '<p>No day-wise orders recorded.</p>'}
      <br/><p style="text-align:right;">Doctor's Signature: ___________________</p>
    </body></html>
  `);
    printWindow.document.close();
    printWindow.print();
  };

  const [clinicalImages, setClinicalImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setClinicalImages(prev => [...prev, { id: Date.now() + Math.random(), name: file.name, dataUrl: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeClinicalImage = (id) => {
    setClinicalImages(prev => prev.filter(img => img.id !== id));
  };

  const [isListening, setIsListening] = useState(false);
  const [negativeHistoryAnswers, setNegativeHistoryAnswers] = useState({});

  const setNegativeHistoryAnswer = (item, answer) => {
    setNegativeHistoryAnswers(prev => {
      // Jo same answer par fari click karyu, to clear kari devu (back to unknown/unasked)
      if (prev[item] === answer) {
        const next = { ...prev };
        delete next[item];
        setSelectedNegativeHistory(list => list.filter(i => i !== item));
        return next;
      }
      setSelectedNegativeHistory(list => {
        const withoutItem = list.filter(i => i !== item);
        return answer === 'no' ? [...withoutItem, item] : withoutItem;
      });
      return { ...prev, [item]: answer };
    });
  };


  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Please use Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setManualHistory(prev => prev ? `${prev} ${transcript}` : transcript);
    };
    recognition.start();
  };


  const loadProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('role, full_name, hospital_id, hospitals(name)')
        .eq('id', userId)
        .single();
    if (error || !data) { setLoginError('No hospital profile found for this login.'); return; }

    const normalizedRole = (data.role || '').toString().trim().toLowerCase();
    console.log('DEBUG role:', JSON.stringify(normalizedRole), 'tabs:', ROLE_TABS[normalizedRole]);
    setCurrentRole({
      role: normalizedRole,
      fullName: data.full_name,
      hospitalId: data.hospital_id,
      hospitalName: data.hospitals?.name,
      tabs: ROLE_TABS[normalizedRole] || [],
    });
    setIsLoggedIn(true);
    setActiveTab((ROLE_TABS[normalizedRole] || [])[0]);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) loadProfile(session.user.id);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        loadProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setCurrentRole(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState('reception');

  const [patients, setPatients] = useState([]);

  const mapDbPatientToUi = (row) => ({
    id: row.display_id, dbId: row.id, name: row.name, age: row.age, gender: row.gender,
    uhid: row.uhid, triage: row.triage, status: row.status, occupation: row.occupation,
    address: row.address, insuranceId: row.insurance_id, contact: row.contact,
    complaint: row.complaint, vitals: row.vitals, diagnoses: row.diagnoses,
    prescriptions: row.prescriptions, savedSymptoms: row.saved_symptoms,
    savedNegativeHistory: row.saved_negative_history, savedInvestigations: row.saved_investigations,
    savedExamValues: row.saved_exam_values, savedAiResult: row.saved_ai_result,
    savedSelectedDdx: row.saved_selected_ddx, investigationsOrdered: row.investigations_ordered,
    savedManualHistory: row.saved_manual_history || '',
    labStatus: row.lab_status, labResults: row.lab_results,
    radiologyDone: row.radiology_done, diagLabDone: row.diag_lab_done,
    completedTests: row.completed_tests || [],
    dailyOrders: row.daily_orders || [],
    nonPharmManagement: row.non_pharm_management || [],
    followUpAdvice: row.follow_up_advice || '',
    admittedAt: row.admitted_at || null,
    dischargedAt: row.discharged_at || null,
    dischargeOutcome: row.discharge_outcome || '',
    dischargeConsent: row.discharge_consent || {},
    dischargeSummary: row.discharge_summary || '',
    visitHistory: row.visit_history || [],
  });

  const fetchPatients = async () => {
    if (!currentRole?.hospitalId) return;
    const { data, error } = await supabase
        .from('patients').select('*')
        .eq('hospital_id', currentRole.hospitalId)
        .neq('status', 'Discharged')
        .order('created_at', { ascending: false });
    if (!error) setPatients(data.map(mapDbPatientToUi));
  };

// Live sync so Reception/Nursing/Doctor/Lab/Pharmacy all see updates instantly
  useEffect(() => {
    if (!currentRole?.hospitalId) return;
    fetchPatients();
    const channel = supabase
        .channel(`patients-${currentRole.hospitalId}`)
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'patients', filter: `hospital_id=eq.${currentRole.hospitalId}` },
            fetchPatients)
        .subscribe();
    return () => supabase.removeChannel(channel);
  }, [currentRole?.hospitalId]);

  const updatePatientInDb = async (dbId, patch) => {
    const { error } = await supabase.from('patients').update(patch).eq('id', dbId);
    if (error) console.error('Supabase update error:', error);
  };

  // Reception Modal State
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [isSubmittingPatient, setIsSubmittingPatient] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('');
  const [newPatientGender, setNewPatientGender] = useState('male');
  const [newPatientTriage, setNewPatientTriage] = useState('GREEN');
  const [newPatientOccupation, setNewPatientOccupation] = useState('');
  const [followUpUhid, setFollowUpUhid] = useState("");
  const [followUpPreview, setFollowUpPreview] = useState(null); // { isDischarged, lastVisitDate, diagnoses, dischargeOutcome, dischargeSummary }
  const [newPatientAddress, setNewPatientAddress] = useState('');
  const [newPatientInsuranceId, setNewPatientInsuranceId] = useState('');
  const [newPatientContact, setNewPatientContact] = useState('');
  const [receptionSearch, setReceptionSearch] = useState('');
  const [nursingSearch, setNursingSearch] = useState('');
  const [doctorQueueSearch, setDoctorQueueSearch] = useState('');
  const [ipdSearch, setIpdSearch] = useState('');
  const [ipdActiveDayMap, setIpdActiveDayMap] = useState({});     // { [patientId]: dayId }
  const [ipdMedInputs, setIpdMedInputs] = useState({});           // { [patientId]: { name, dosage, duration } }
  const [ipdAdviceInputs, setIpdAdviceInputs] = useState({});// { [patientId]: adviceText }
  const [ipdProcedureInputs, setIpdProcedureInputs] = useState({}); // { [patientId]: procedureText }
  const [ipdVitalInputs, setIpdVitalInputs] = useState({});         // { [patientId]: { bp, pulse, temp, spo2 } }
  const [ipdInvestigationInputs, setIpdInvestigationInputs] = useState({}); // { [patientId]: string }
  const ipdVitalRefs = React.useRef({}); // { [patientId]: { time, bp, pulse, temp, spo2 } refs }

  const setIpdVitalRef = (patientId, field, el) => {
    if (!ipdVitalRefs.current[patientId]) ipdVitalRefs.current[patientId] = {};
    ipdVitalRefs.current[patientId][field] = el;
  };
  // --- Discharge Modal State ---
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [dischargeStep, setDischargeStep] = useState(1);
  const [dischargePatient, setDischargePatient] = useState(null);
  const [dischargeOutcome, setDischargeOutcome] = useState('');
  const [consentGiverName, setConsentGiverName] = useState('');
  const [consentRelation, setConsentRelation] = useState('');
  const [consentMobile, setConsentMobile] = useState('');
  const [consentReason, setConsentReason] = useState('');
  const [dischargeSummary, setDischargeSummary] = useState('');
  const [dischargeSummaryLoading, setDischargeSummaryLoading] = useState(false);
  const [dischargeSummaryError, setDischargeSummaryError] = useState('');
  const [pharmacySearch, setPharmacySearch] = useState('');
  const [labSearch, setLabSearch] = useState('');
  const [labCategoryFilter, setLabCategoryFilter] = useState('All');
  const [radiologyImages, setRadiologyImages] = useState({}); // { [patientId]: [{id, name, dataUrl}] }

  const handleRadiologyImageUpload = (patientId, e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setRadiologyImages(prev => ({
          ...prev,
          [patientId]: [...(prev[patientId] || []), { id: Date.now() + Math.random(), name: file.name, dataUrl: reader.result }],
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeRadiologyImage = (patientId, imgId) => {
    setRadiologyImages(prev => ({
      ...prev,
      [patientId]: (prev[patientId] || []).filter(img => img.id !== imgId),
    }));
  };

  // Nursing Station Vitals Input State
  const [vitalInputs, setVitalInputs] = useState({});

  // Doctor Panel State
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [consultStep, setConsultStep] = useState('history');

  // Symptoms & AI Diagnosis State
  const [symptomSearch, setSymptomSearch] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomFilter, setSymptomFilter] = useState('All');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState('');
  const [selectedDdx, setSelectedDdx] = useState([]);
  const [selectedAiLabs, setSelectedAiLabs] = useState([]);

// Manual History & Duration Tracking State
  const [manualHistory, setManualHistory] = useState('');
  const [symptomDurations, setSymptomDurations] = useState({});
  const [openDurationFor, setOpenDurationFor] = useState(null);

  // Prescription State
  const [acceptedDiagnosis, setAcceptedDiagnosis] = useState([]);
  const [manualDiagnosis, setManualDiagnosis] = useState('');
  const [followUpAdvice, setFollowUpAdvice] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [aiRxLoading, setAiRxLoading] = useState(false);
  const [aiRxError, setAiRxError] = useState('');
  const [nonPharmManagement, setNonPharmManagement] = useState([]);
  const [manualAdviceInput, setManualAdviceInput] = useState('');
  const [manualProcedureInput, setManualProcedureInput] = useState('');
  const [aiRouteOfCare, setAiRouteOfCare] = useState(null); // 'OPD' | 'IPD' | null
  const [routeOverride, setRouteOverride] = useState(null); // doctor's manual override
  const [planSubTab, setPlanSubTab] = useState('rx'); // 'rx' | 'procedures' | 'nonpharm' | 'followup'

  // Manual Medicine Input State
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('1-0-1');
  const [medDuration, setMedDuration] = useState('3 Days');

  // Pharmacy Inventory State
  // Pharmacy Inventory State — loaded from Supabase per hospital + realtime sync
  const [inventory, setInventory] = useState([]);
  useEffect(() => {
    if (!currentRole?.hospitalId) return;
    const loadInv = () => supabase.from('inventory').select('*').eq('hospital_id', currentRole.hospitalId)
        .then(({ data }) => data && setInventory(data));
    loadInv();
    const channel = supabase
        .channel(`inventory-${currentRole.hospitalId}`)
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'inventory', filter: `hospital_id=eq.${currentRole.hospitalId}` },
            loadInv)
        .subscribe();
    return () => supabase.removeChannel(channel);
  }, [currentRole?.hospitalId]);

  const [editingStockId, setEditingStockId] = useState(null);
  const [stockInput, setStockInput] = useState("");
  const [newMedName, setNewMedName] = useState("");
  const [newMedStock, setNewMedStock] = useState("");


  const activePatient = patients.find(p => p.id === selectedPatientId);
  useEffect(() => {
    if (activePatient?.savedSymptoms && activePatient.savedSymptoms.length > 0) {
      setSelectedSymptoms(activePatient.savedSymptoms);
      setSelectedNegativeHistory(activePatient.savedNegativeHistory || []);
      const restoredAnswers = {};
      (activePatient.savedNegativeHistory || []).forEach(item => { restoredAnswers[item] = 'no'; });
      setNegativeHistoryAnswers(restoredAnswers);
      setSelectedInvestigations(activePatient.savedInvestigations || []);
      setExamValues(activePatient.savedExamValues || {});
      setAiResult(activePatient.savedAiResult || null);
      setSelectedDdx(activePatient.savedSelectedDdx || []);
      setConsultStep('findings')
    } else {
      setSelectedSymptoms([]);
      setSelectedNegativeHistory([]);
      setNegativeHistoryAnswers({});
      setSelectedInvestigations([]);
      setExamValues({});
      setAiResult(null);
      setSelectedDdx([]);
      setConsultStep('history');
    }
    setAiExamError('');
    setManualHistory('');
    setExamSuggestions(null);
    setAiExamLoading(false);
    setManualDiagnosis('');
    setFollowUpAdvice('');
    setAiRouteOfCare(null);
    setRouteOverride(null);
    setManualAdviceInput('');
    setManualProcedureInput('');
    setPlanSubTab('rx');
  }, [selectedPatientId]);

// Make sure we have a selected patient if navigating to doctor tab
  useEffect(() => {
    if (activeTab === 'doctor' && !selectedPatientId) {
      const firstDocPt = patients.find(p => p.status === 'Doctor');
      if (firstDocPt) setSelectedPatientId(firstDocPt.id);
    }
  }, [activeTab, patients, selectedPatientId]);

  // --- Reception Actions ---

  const searchFollowUpPatient = async (query) => {
    if (!query.trim()) {
      setFollowUpPreview(null);
      setNewPatientName('');
      setNewPatientAge('');
      setNewPatientGender('male');
      setNewPatientAddress('');
      setNewPatientOccupation('');
      setNewPatientInsuranceId('');
      setNewPatientContact('');
      return;
    }
    const q = query.trim().toLowerCase();

    // Pehla current active list (Nursing/Doctor/IPD/Pharmacy) ma shodho
    let found = patients.find(p =>
        p.uhid.toLowerCase() === q || p.name.toLowerCase().includes(q)
    );

    // Active list ma na madyu to discharged patients samet DIRECT Supabase mathi shodho
    if (!found && currentRole?.hospitalId) {
      const { data } = await supabase
          .from('patients')
          .select('*')
          .eq('hospital_id', currentRole.hospitalId)
          .or(`uhid.ilike.%${query.trim()}%,name.ilike.%${query.trim()}%`)
          .order('created_at', { ascending: false })
          .limit(1);
      if (data && data.length > 0) {
        found = mapDbPatientToUi(data[0]);
      }
    }

    if (found) {
      const isDischarged = found.status === 'Discharged';
      const lastVisit = (found.visitHistory && found.visitHistory.length > 0)
          ? found.visitHistory[found.visitHistory.length - 1]
          : null;

      setFollowUpPreview({
        isDischarged,
        lastVisitDate: found.dischargedAt
            ? new Date(found.dischargedAt).toLocaleDateString('en-GB')
            : (lastVisit?.date ? new Date(lastVisit.date).toLocaleDateString('en-GB') : null),
        diagnoses: (found.diagnoses && found.diagnoses.length > 0)
            ? found.diagnoses.join(', ')
            : ((lastVisit?.diagnoses && lastVisit.diagnoses.length > 0) ? lastVisit.diagnoses.join(', ') : ''),
        dischargeOutcome: found.dischargeOutcome || '',
        dischargeSummary: found.dischargeSummary || lastVisit?.dischargeSummary || '',
      });

      setNewPatientName(found.name);
      setNewPatientAge(found.age.replace('y', ''));
      setNewPatientGender(found.gender);
      setNewPatientAddress(found.address || '');
      setNewPatientOccupation(found.occupation || '');
      setNewPatientInsuranceId(found.insuranceId || '');
      setNewPatientContact(found.contact || '');
    } else {
      setFollowUpPreview(null);
      setNewPatientName('');
      setNewPatientAge('');
      setNewPatientAddress('');
      setNewPatientOccupation('');
      setNewPatientInsuranceId('');
      setNewPatientContact('');
    }
  };

  const generateNextUhid = async () => {
    const year = new Date().getFullYear();
    const prefix = `CHCD/${year}/`;
    const { data } = await supabase
        .from('patients')
        .select('uhid')
        .eq('hospital_id', currentRole.hospitalId)
        .like('uhid', `${prefix}%`)
        .order('uhid', { ascending: false })
        .limit(1);

    let nextNum = 3000; // starting point => 003000
    if (data && data.length > 0) {
      const lastNum = parseInt(data[0].uhid.split('/').pop(), 10);
      if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }
    return `${prefix}${String(nextNum).padStart(6, '0')}`;
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();

    if (isSubmittingPatient) return;
    setIsSubmittingPatient(true);

    try {
      // Follow-up: reactivate existing patient by UHID or name (discharged patients samet)
      if (followUpUhid.trim()) {
        const q = followUpUhid.trim().toLowerCase();
        let existing = patients.find(p =>
            p.uhid.toLowerCase() === q || p.name.toLowerCase().includes(q)
        );

        // Active list ma na madyu to discharged patients samet DB mathi direct shodho
        if (!existing && currentRole?.hospitalId) {
          const { data } = await supabase
              .from('patients')
              .select('*')
              .eq('hospital_id', currentRole.hospitalId)
              .or(`uhid.ilike.%${followUpUhid.trim()}%,name.ilike.%${followUpUhid.trim()}%`)
              .order('created_at', { ascending: false })
              .limit(1);
          if (data && data.length > 0) {
            existing = mapDbPatientToUi(data[0]);
          }
        }

        // existing local `patients` state ma hoy k na hoy (discharged hoy to na hoy) e track karo
        const wasInLocalList = existing ? patients.some(p => p.id === existing.id) : false;

        if (existing) {

          const newHistoryEntry = {
            date: new Date().toISOString(),
            complaint: existing.complaint || '',
            diagnoses: existing.diagnoses || [],
            prescriptions: (existing.prescriptions || []).map(m => ({ name: m.name, dosage: m.dosage, duration: m.duration })),
            dischargeSummary: existing.dischargeSummary || '',
            labResults: existing.labResults || '',
          };
          const updatedVisitHistory = (existing.diagnoses && existing.diagnoses.length > 0)
              ? [...(existing.visitHistory || []), newHistoryEntry]
              : (existing.visitHistory || []);


          const resetPatch = {
            status: 'Nursing',
            complaint: newPatientOccupation || 'Follow-up visit',
            triage: newPatientTriage,
            vitals: null,
            savedSymptoms: [],
            savedNegativeHistory: [],
            savedInvestigations: [],
            savedExamValues: {},
            savedAiResult: null,
            savedSelectedDdx: [],
            investigationsOrdered: [],
            completedTests: [],
            labStatus: null,
            labResults: '',
            labImages: [],
            radiologyDone: false,
            diagLabDone: false,
            diagnoses: [],
            prescriptions: [],
            nonPharmManagement: [],
            followUpAdvice: '',
            dailyOrders: [],
          };

          if (wasInLocalList) {
            setPatients(patients.map(p => p.id === existing.id ? { ...p, ...resetPatch } : p));
          } else {
            // Discharged patient hato — active list ma pachho ummero
            setPatients([{ ...existing, ...resetPatch }, ...patients]);
          }

          updatePatientInDb(existing.dbId, {
            status: 'Nursing',
            complaint: resetPatch.complaint,
            triage: newPatientTriage,
            vitals: null,
            saved_symptoms: [],
            saved_negative_history: [],
            saved_investigations: [],
            saved_exam_values: {},
            saved_ai_result: null,
            saved_selected_ddx: [],
            investigations_ordered: [],
            completed_tests: [],
            lab_status: null,
            lab_results: '',
            radiology_done: false,
            diag_lab_done: false,
            diagnoses: [],
            prescriptions: [],
            non_pharm_management: [],
            follow_up_advice: '',
            daily_orders: [],
            visit_history: updatedVisitHistory,
          });

          setFollowUpUhid("");
          setFollowUpPreview(null);
          setNewPatientName('');
          setNewPatientAge('');
          setNewPatientOccupation('');
          setNewPatientAddress('');
          setNewPatientInsuranceId('');
          setNewPatientContact('');
          setShowAddPatientModal(false);
          return;
        } else {
          alert("No patient found with this UHID or name.");
          return;
        }
      }

      // New patient
      if (!newPatientName.trim()) return;

      const newUhid = await generateNextUhid();

      const { data: inserted, error } = await supabase.from('patients').insert({
        hospital_id: currentRole.hospitalId,
        display_id: `#${Math.floor(Math.random() * 9000 + 10)}`,
        name: newPatientName, age: `${newPatientAge}y`, gender: newPatientGender,
        uhid: newUhid,
        triage: newPatientTriage, status: 'Nursing',
        occupation: newPatientOccupation || '', address: newPatientAddress || '',
        insurance_id: newPatientInsuranceId || '', contact: newPatientContact || '',
        vitals: null,
      }).select().single();

      if (error) {
        console.error('Patient registration failed:', error);
        alert(`Could not register patient: ${error.message}`);
        return; // stop here — keep the modal open and the form filled so nothing is lost
      }

      setPatients([mapDbPatientToUi(inserted), ...patients]);
      setNewPatientName('');
      setNewPatientAge('');
      setNewPatientOccupation('');
      setNewPatientAddress('');
      setNewPatientInsuranceId('');
      setNewPatientContact('');
      setShowAddPatientModal(false);
    } finally {
      setIsSubmittingPatient(false);
    }
  };

  // --- Nursing Station Actions ---
  const handleVitalsChange = (patientId, field, value) => {
    setVitalInputs(prev => ({
      ...prev,
      [patientId]: {
        ...(prev[patientId] || patients.find(p => p.id === patientId)?.vitals || { bp: '', pulse: '', temp: '', spo2: '' }),
        [field]: value
      }
    }));
  };

  const forwardToDoctor = (patientId) => {
    const defaultVitals = { bp: '120/80', pulse: '78', temp: '98.6', spo2: '98' };
    const vitals = vitalInputs[patientId] || patients.find(p => p.id === patientId)?.vitals || defaultVitals;

    const target = patients.find(p => p.id === patientId);
    setPatients(patients.map(p => p.id === patientId ? { ...p, status: 'Doctor', vitals } : p));
    updatePatientInDb(target.dbId, { status: 'Doctor', vitals });


    setVitalInputs(prev => {
      const newState = {...prev};
      delete newState[patientId];
      return newState;
    });
  };

  // --- Doctor Panel Actions ---
  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.find(s => s.id === symptom.id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptom.id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
      setSymptomSearch('');
    }
  };

  const DURATION_UNITS = ['Days', 'Weeks', 'Months', 'Years'];

  const setDuration = (symptomId, num, unit) => {
    setSymptomDurations(prev => ({ ...prev, [symptomId]: { num, unit } }));
  };

  const clearDuration = (symptomId) => {
    setSymptomDurations(prev => {
      const next = { ...prev };
      delete next[symptomId];
      return next;
    });
  };

  const runAIEngine = async () => {
    if (selectedSymptoms.length === 0 && !manualHistory) return;
    setAiLoading(true);
    setAiError('');
    setAiResult(null);

    const symNames = selectedSymptoms.map(s => {
      const d = symptomDurations[s.id];
      return d && d.num ? `${s.name} (x ${d.num} ${d.unit})` : s.name;
    }).join(', ');

    const hasImages = clinicalImages.length > 0;

    const promptText = `
      You are a multi-disciplinary panel of senior consultants working as a single expert AI — spanning General Medicine (Harrison's Principles of Internal Medicine), General Surgery (Bailey & Love's Short Practice of Surgery), Obstetrics & Gynecology (Williams Obstetrics, Dutta's Textbook of Obstetrics, Shaw's Textbook of Gynecology), Pediatrics (Nelson Textbook of Pediatrics), Orthopedics (Apley's), ENT, Dermatology, Ophthalmology, and Psychiatry. Identify which specialty the presentation actually belongs to from the symptoms and profile below, and reason at that specialty's full depth — an OBG case must be worked up with obstetric/gynecological rigor (gravida/para, gestational age where relevant, obstetric red flags), not generic internal-medicine reasoning, and the same principle applies for surgical, pediatric, or psychiatric presentations.
     
      Patient Profile: ${activePatient?.age}, ${activePatient?.gender}.
      Occupation: ${activePatient?.occupation}.
      
      Vitals: ${activePatient?.vitals ? `BP ${activePatient.vitals.bp} mmHg, Pulse ${activePatient.vitals.pulse} bpm, Temp ${activePatient.vitals.temp}°F, SpO2 ${activePatient.vitals.spo2}%` : 'Not recorded'}.
      Selected Clinical Findings & Symptoms: ${symNames}.
Doctor's Manual History: ${manualHistory || 'Not provided'}.
Negative History: ${selectedNegativeHistory.join(', ') || 'None confirmed'}.
Investigations Ordered: ${selectedInvestigations.join(', ') || 'None selected'}.

General Examination Findings: ${
        (examSuggestions?.generalExamination || [])
            .map(param => `${param.name}: ${(examValues[param.name] && examValues[param.name].trim()) ? examValues[param.name] : (param.normalRange || 'Normal')}`)
            .join(', ') || 'Not documented'
    }.
Systemic Examination Findings: ${
        (examSuggestions?.systemicExamination || [])
            .map(param => `${param.name}: ${(examValues[param.name] && examValues[param.name].trim()) ? examValues[param.name] : (param.normalRange || 'Normal')}`)
            .join(', ') || 'Not documented'
    }. 
${activePatient?.labResults ? `Lab Investigation Results: ${activePatient.labResults}.` : ''}
      
Based on the complete patient summary above (symptoms, manual history, negative history, examination findings, and investigations), and standard modern medicine textbook provide a highly accurate Provisional Differential Diagnosis (top 3-4 conditions, ranked by likelihood) and suggest any additional standard laboratory/radiological investigations not already ordered.
      
      You MUST return your response as a valid JSON object matching exactly this schema (do not include markdown block ticks around it):
      {
        "ddx": ["Diagnosis 1", "Diagnosis 2", "Diagnosis 3"],
        "labs": ["Investigation 1", "Investigation 2", "Investigation 3"]
        "reasoning": "Short paragraph explaining the clinical reasoning behind the above differential diagnosis list."
      }
    `;


    const grokApiUrl = "https://api.groq.com/openai/v1/chat/completions";

    // Jo images hoy to vision model vapro, ane content ne text+image array banavo
    const messageContent = hasImages
        ? [
          { type: "text", text: promptText + "\n\nAlso examine the attached clinical image(s) (rash, wound, swelling etc.) and factor visual findings into the differential diagnosis." },
          ...clinicalImages.map(img => ({
            type: "image_url",
            image_url: { url: img.dataUrl }
          }))
        ]
        : promptText;

    try {
      const response = await fetch(grokApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          response_format: {type: "json_object"},
          messages: [
            {
              role: "user",
              content: messageContent
            }
          ]
        })
      });

      if (!response.ok) {
        try {
          // Attempt to parse the error as JSON
          const errorData = await response.json();
          console.error("Groq API Error:", errorData);
          setAiError(errorData.error?.message || `API request failed: ${response.status}`);
        } catch (parseError) {
          // Fallback if the server returns HTML/Text (e.g., 502 Bad Gateway)
          console.error(`Groq API Error (Non-JSON): ${response.status} ${response.statusText}`);
          setAiError(`Server error: ${response.status} ${response.statusText}`);
        }
        return;
      }

      const data = await response.json();
      const resultText = data.choices?.[0]?.message?.content;

      if (resultText) {
        const parsedResult = JSON.parse(resultText);
        setAiResult(parsedResult);
        setSelectedDdx(parsedResult.ddx || []);
        setConsultStep('diagnosis');
      } else {
        console.error("AI Engine returned an empty response");
      }
    } catch (error) {
      console.error("API Error:", error);
      setAiError("Failed to connect to AI Engine. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };//

    const toggleDdxSelection = (diagnosis) => {
      if (selectedDdx.includes(diagnosis)) {
        setSelectedDdx(selectedDdx.filter(d => d !== diagnosis));
      } else {
        setSelectedDdx([...selectedDdx, diagnosis]);
      }
    };

  const toggleAiLab = (lab) => {
    setSelectedAiLabs(prev =>
        prev.includes(lab) ? prev.filter(l => l !== lab) : [...prev, lab]
    );
  };

  const sendDiagnosisLabsToLab = () => {
    if (!activePatient || selectedAiLabs.length === 0) return;
    const mergedInvestigations = Array.from(new Set([...selectedInvestigations, ...selectedAiLabs]));
    const finalExamValues = buildFinalExamValues();
    const patch = {
      status: 'Doctor',
      labStatus: 'Pending',
      investigationsOrdered: mergedInvestigations,
      savedNegativeHistory: selectedNegativeHistory || [],
      savedInvestigations: mergedInvestigations,
      savedExamValues: finalExamValues,
      savedSymptoms: selectedSymptoms,
      savedManualHistory: manualHistory,
      savedAiResult: aiResult,
      savedSelectedDdx: selectedDdx,
    };
    setPatients(patients.map(p => p.id === activePatient.id ? { ...p, ...patch } : p));
    updatePatientInDb(activePatient.dbId, {
      status: 'Doctor',
      lab_status: 'Pending',
      investigations_ordered: mergedInvestigations,
      saved_negative_history: patch.savedNegativeHistory,
      saved_investigations: patch.savedInvestigations,
      saved_exam_values: patch.savedExamValues,
      saved_symptoms: patch.savedSymptoms,
      saved_manual_history: patch.savedManualHistory,
      saved_ai_result: patch.savedAiResult,
      saved_selected_ddx: patch.savedSelectedDdx,
    });
    setSelectedPatientId(null);
  };

  const sendToLab = () => {
    if (!activePatient) return;
    const finalExamValues = buildFinalExamValues();
    const patch = {
      status: 'Doctor',
      labStatus: 'Pending',
      investigationsOrdered: selectedInvestigations || [],
      savedNegativeHistory: selectedNegativeHistory || [],
      savedInvestigations: selectedInvestigations || [],
      savedExamValues: finalExamValues,
      savedSymptoms: selectedSymptoms,
      savedManualHistory: manualHistory,
      savedAiResult: aiResult,
      savedSelectedDdx: selectedDdx,
    };
    setPatients(patients.map(p => p.id === activePatient.id ? { ...p, ...patch } : p));
    updatePatientInDb(activePatient.dbId, {
      status: 'Doctor',
      lab_status: 'Pending',
      investigations_ordered: patch.investigationsOrdered,
      saved_negative_history: patch.savedNegativeHistory,
      saved_investigations: patch.savedInvestigations,
      saved_exam_values: patch.savedExamValues,
      saved_symptoms: patch.savedSymptoms,
      saved_manual_history: patch.savedManualHistory,
      saved_ai_result: patch.savedAiResult,
      saved_selected_ddx: patch.savedSelectedDdx,
    });
  };

  const saveLabResults = (patientId, resultsText) => {
    const images = radiologyImages[patientId] || [];
    const target = patients.find(p => p.id === patientId);
    setPatients(patients.map(p =>
        p.id === patientId
            ? {
              ...p,
              labResults: resultsText,
              labImages: images,
              status: 'Doctor',
              labStatus: 'Completed'
            }
            : p
    ));
    if (target) {
      updatePatientInDb(target.dbId, {
        lab_results: resultsText,
        status: 'Doctor',
        lab_status: 'Completed',
      });
    }
    setRadiologyImages(prev => {
      const next = { ...prev };
      delete next[patientId];
      return next;
    });
  };

  const acceptDiagnosis = () => {
    const manual = manualDiagnosis.trim();
    const finalDx = manual ? [...selectedDdx, manual] : selectedDdx;
    if (finalDx.length === 0) return;
    setAcceptedDiagnosis(finalDx);
    setNonPharmManagement([]);
    if (activePatient) {
      const finalExamValues = buildFinalExamValues();
      setPatients(prev => prev.map(p => p.id === activePatient.id ? { ...p, savedExamValues: finalExamValues, savedManualHistory: manualHistory } : p));
      updatePatientInDb(activePatient.dbId, { saved_exam_values: finalExamValues, saved_manual_history: manualHistory });
    }
    setConsultStep('plan');
  };

    const generateAIPrescription = async () => {
      if (acceptedDiagnosis.length === 0) return;
      setAiRxLoading(true);
      setAiRxError('');

      const diagnosisList = acceptedDiagnosis.join(', ');
      const promptText = `
      You are a multi-disciplinary panel of senior consultants writing a complete, evidence-based treatment plan as a single expert AI — spanning General Medicine (Harrison's Principles of Internal Medicine), General Surgery (Sabiston Textbook of Surgery), Obstetrics & Gynecology (Williams Obstetrics, Dutta's Textbook of Obstetrics, Shaw's Textbook of Gynecology, FOGSI guidelines), Pediatrics, Orthopedics, and Psychiatry. Match the treatment plan's specialty depth to the diagnosis given — an obstetric or gynecological diagnosis must get an OBG-specialist-grade plan (correct drug safety category for pregnancy/lactation where relevant, standard OBG monitoring and referral thresholds), not a generic internal-medicine plan.
      
      Patient Profile: ${activePatient?.age}, ${activePatient?.gender}.
      Final Diagnosis: ${diagnosisList}.
      Vitals: ${activePatient?.vitals ? JSON.stringify(activePatient.vitals) : 'Not recorded'}.
      Triage: ${activePatient?.triage}.

      IMPORTANT SAFETY INSTRUCTION: Do not default to oral medication out of caution. If the diagnosis, severity, vitals, or triage level (e.g., RED/unstable vitals, sepsis, severe dehydration, inability to tolerate oral intake, severe infection, obstetric emergency) clinically warrants IV/parenteral therapy or inpatient monitoring under standard guidelines, you MUST prescribe the appropriate IV medications/fluids and set "routeOfCare" to "IPD". Only use "OPD" when oral/outpatient management is genuinely sufficient per guidelines. Under-prescribing IV therapy when indicated is a critical error to avoid.

      Generate a complete management plan for this diagnosis, including:
      1. "medications" - standard pharmacological prescription with proper drug names, dosages, durations, and instructions. Prefix IV medications clearly, e.g. "Inj. Ceftriaxone 1g IV BD".
      2. "nonPharmacological" - non-drug management: lifestyle/diet advice, physiotherapy, wound care, monitoring instructions, referral advice, etc.
      3. "proceduralManagement" - any surgical or procedural interventions indicated for this diagnosis (e.g., incision & drainage, suturing, splinting, referral for surgery). If none are indicated, return an empty array.
      4. "routeOfCare" - "IPD" if inpatient admission and IV therapy/monitoring is clinically indicated, otherwise "OPD".
      5. "routeReason" - one short sentence justifying the routeOfCare decision.

      You MUST return your response as a valid JSON object matching exactly this schema (no markdown formatting):
      {
        "medications": [
          {
            "name": "Full drug name and strength (e.g., Tab. Paracetamol 500mg or Inj. Ceftriaxone 1g IV BD)",
            "dosage": "e.g., 1-0-1 or STAT",
            "duration": "e.g., 3 Days",
            "note": "e.g., After meals"
          }
        ],
        "nonPharmacological": ["Advice 1", "Advice 2"],
        "proceduralManagement": ["Procedure 1", "Procedure 2"],
        "routeOfCare": "OPD",
        "routeReason": "..."
      }
    `;

      try {
        const groqApiUrl = "https://api.groq.com/openai/v1/chat/completions";

        const response = await fetch(groqApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            response_format: {type: "json_object"},
            messages: [
              {
                role: "user",
                content: promptText
              }
            ]
          })
        });

      const data = await response.json();
      const resultText = data.choices?.[0]?.message?.content;

        if (resultText) {
          const parsedResult = JSON.parse(resultText);
          const newMeds = (parsedResult.medications || []).map((m, index) => ({
            id: Date.now() + index,
            ...m
          }));
          setPrescriptions(newMeds);
          setNonPharmManagement([
            ...(parsedResult.nonPharmacological || []).map(t => ({ type: 'Advice', text: t })),
            ...(parsedResult.proceduralManagement || []).map(t => ({ type: 'Procedure', text: t })),
          ]);
          setAiRouteOfCare(parsedResult.routeOfCare === 'IPD' ? 'IPD' : 'OPD');
          setRouteOverride(null);
        } else {
          setAiRxError("AI Engine returned an empty prescription.");
        }

    } catch (err) {
    console.error(err);
    setAiRxError("Failed to generate AI Prescription. Please try again.");
  } finally {
    setAiRxLoading(false);
  }
};
    const addManualMedicine = () => {
      if (!medName.trim()) return;
      const newMed = {
        id: Date.now(),
        name: medName,
        dosage: medDosage,
        duration: medDuration,
        note: ''
      };
      setPrescriptions([...prescriptions, newMed]);
      setMedName('');
    };

    const removeMedicine = (id) => {
      setPrescriptions(prescriptions.filter(m => m.id !== id));
    };
  const addManualAdvice = () => {
    const text = manualAdviceInput.trim();
    if (!text) return;
    setNonPharmManagement([...nonPharmManagement, { type: 'Advice', text }]);
    setManualAdviceInput('');
  };

  const addManualProcedure = () => {
    const text = manualProcedureInput.trim();
    if (!text) return;
    setNonPharmManagement([...nonPharmManagement, { type: 'Procedure', text }]);
    setManualProcedureInput('');
  };

  const removeNonPharmItem = (index) => {
    setNonPharmManagement(nonPharmManagement.filter((_, i) => i !== index));
  };

  const getLatestVitals = (patient) => {
    const days = patient.dailyOrders || [];
    for (let i = days.length - 1; i >= 0; i--) {
      const log = days[i].vitalsLog || [];
      if (log.length > 0) return log[log.length - 1];
    }
    return patient.vitals || null;
  };

  const getActiveIpdDay = (patient) => {
    const days = patient.dailyOrders || [];
    const activeId = ipdActiveDayMap[patient.id];
    return days.find(d => d.id === activeId) || days[days.length - 1] || null;
  };

  const saveIpdDailyOrders = (patient, updatedDays) => {
    setPatients(patients.map(p => p.id === patient.id ? { ...p, dailyOrders: updatedDays } : p));
    updatePatientInDb(patient.dbId, { daily_orders: updatedDays });
  };

  const addIpdDay = (patient) => {
    const days = patient.dailyOrders || [];
    const lastDay = days[days.length - 1];
    const newDay = {
      id: `day-${Date.now()}`,
      label: `Day ${days.length + 1}`,
      date: new Date().toLocaleDateString('en-GB'),
      meds: (lastDay?.meds || []).map(m => ({ ...m, id: Date.now() + Math.random() })),
      advice: (lastDay?.advice || []).map(a => ({ ...a, id: Date.now() + Math.random() })),
      procedures: (lastDay?.procedures || []).map(pr => ({ ...pr, id: Date.now() + Math.random() })),
      vitalsLog: [],
    };
    const updatedDays = [...days, newDay];
    saveIpdDailyOrders(patient, updatedDays);
    setIpdActiveDayMap(prev => ({ ...prev, [patient.id]: newDay.id }));
  };

  const handleIpdMedInputChange = (patientId, field, value) => {
    setIpdMedInputs(prev => ({
      ...prev,
      [patientId]: {
        ...(prev[patientId] || { name: '', dosage: '1-0-1', duration: '1 Day' }),
        [field]: value,
      },
    }));
  };

  const addIpdMedication = (patient) => {
    const activeDay = getActiveIpdDay(patient);
    if (!activeDay) return; // no day selected/created yet
    const input = ipdMedInputs[patient.id];
    if (!input || !input.name || !input.name.trim()) return;
    const newMed = {
      id: Date.now(),
      name: input.name.trim(),
      dosage: input.dosage || '1-0-1',
      duration: input.duration || '1 Day',
      note: '',
      given: false,
    };
    const updatedDays = (patient.dailyOrders || []).map(d =>
        d.id === activeDay.id ? { ...d, meds: [...d.meds, newMed] } : d
    );
    saveIpdDailyOrders(patient, updatedDays);
    setIpdMedInputs(prev => ({ ...prev, [patient.id]: { name: '', dosage: '1-0-1', duration: '1 Day' } }));
  };

  const toggleIpdMedGiven = (patient, dayId, medId) => {
    const updatedDays = (patient.dailyOrders || []).map(d =>
        d.id === dayId
            ? { ...d, meds: d.meds.map(m => m.id === medId ? { ...m, given: !m.given } : m) }
            : d
    );
    saveIpdDailyOrders(patient, updatedDays);
  };

  const removeIpdMedication = (patient, dayId, medId) => {
    const updatedDays = (patient.dailyOrders || []).map(d =>
        d.id === dayId ? { ...d, meds: d.meds.filter(m => m.id !== medId) } : d
    );
    saveIpdDailyOrders(patient, updatedDays);
  };

  const addIpdAdvice = (patient) => {
    const activeDay = getActiveIpdDay(patient);
    const text = (ipdAdviceInputs[patient.id] || '').trim();
    if (!activeDay || !text) return;
    const newAdvice = { id: Date.now(), text };
    const updatedDays = (patient.dailyOrders || []).map(d =>
        d.id === activeDay.id ? { ...d, advice: [...d.advice, newAdvice] } : d
    );
    saveIpdDailyOrders(patient, updatedDays);
    setIpdAdviceInputs(prev => ({ ...prev, [patient.id]: '' }));
  };

  const removeIpdAdvice = (patient, dayId, adviceId) => {
    const updatedDays = (patient.dailyOrders || []).map(d =>
        d.id === dayId ? { ...d, advice: d.advice.filter(a => a.id !== adviceId) } : d
    );
    saveIpdDailyOrders(patient, updatedDays);
  };

  const addIpdProcedure = (patient) => {
    const activeDay = getActiveIpdDay(patient);
    const text = (ipdProcedureInputs[patient.id] || '').trim();
    if (!activeDay || !text) return;
    const newProcedure = { id: Date.now(), text };
    const updatedDays = (patient.dailyOrders || []).map(d =>
        d.id === activeDay.id ? { ...d, procedures: [...(d.procedures || []), newProcedure] } : d
    );
    saveIpdDailyOrders(patient, updatedDays);
    setIpdProcedureInputs(prev => ({ ...prev, [patient.id]: '' }));
  };

  const removeIpdProcedure = (patient, dayId, procedureId) => {
    const updatedDays = (patient.dailyOrders || []).map(d =>
        d.id === dayId ? { ...d, procedures: (d.procedures || []).filter(pr => pr.id !== procedureId) } : d
    );
    saveIpdDailyOrders(patient, updatedDays);
  };

  const openDischargeModal = (patient) => {
    setDischargePatient(patient);
    setDischargeStep(1);
    setDischargeOutcome('');
    setConsentGiverName('');
    setConsentRelation('');
    setConsentMobile('');
    setConsentReason('');
    setDischargeSummary('');
    setDischargeSummaryError('');
    setShowDischargeModal(true);
  };

  const generateDischargeSummary = async () => {
    if (!dischargePatient) return;
    setDischargeSummaryLoading(true);
    setDischargeSummaryError('');

    const admissionStr = dischargePatient.admittedAt
        ? new Date(dischargePatient.admittedAt).toLocaleString('en-IN')
        : 'Not recorded';
    const dischargeStr = new Date().toLocaleString('en-IN');

    const latestVitals = getLatestVitals(dischargePatient);
    const vitalsStr = latestVitals
        ? `BP ${latestVitals.bp}, Pulse ${latestVitals.pulse}, Temp ${latestVitals.temp}, SpO2 ${latestVitals.spo2}${latestVitals.time ? ` (recorded at ${latestVitals.time})` : ''}`
        : 'Not recorded';

    const admissionVitalsStr = dischargePatient.vitals
        ? `BP ${dischargePatient.vitals.bp}, Pulse ${dischargePatient.vitals.pulse}, Temp ${dischargePatient.vitals.temp}, SpO2 ${dischargePatient.vitals.spo2}`
        : 'Not recorded';

    const daysSummary = (dischargePatient.dailyOrders || []).map(day => {
      const medsStr = (day.meds || []).map(m => `${m.name} (${m.dosage}, ${m.duration})`).join('; ') || 'None';
      const adviceStr = (day.advice || []).map(a => a.text).join('; ') || 'None';
      const procStr = (day.procedures || []).map(pr => pr.text).join('; ') || 'None';
      const vitalsLogStr = (day.vitalsLog || []).map(v => `${v.time}: BP ${v.bp}, Pulse ${v.pulse}, Temp ${v.temp}, SpO2 ${v.spo2}`).join(' | ') || 'Not recorded';
      return `${day.label}${day.date ? ` (${day.date})` : ''}: Vitals[${vitalsLogStr}]; Medications[${medsStr}]; Advice[${adviceStr}]; Procedures[${procStr}]`;
    }).join('\n');

    const consentStr = ['LAMA', 'DAMA', 'Referred', 'Death / Expired'].includes(dischargeOutcome)
        ? `Consent Given By: ${consentGiverName || 'Not recorded'}, Relation: ${consentRelation || 'Not recorded'}, Mobile: ${consentMobile || 'Not recorded'}, Reason: ${consentReason || 'Not recorded'}`
        : 'N/A';

    const promptText = `
You are a senior consultant preparing a formal Discharge Summary as per NABH/JCI documentation standards, using the same clinical reasoning depth as the diagnosis and treatment plan already generated for this patient.

Patient: ${dischargePatient.name}, ${dischargePatient.age}, ${dischargePatient.gender}, UHID: ${dischargePatient.uhid}.
Chief Complaint at Admission: ${dischargePatient.complaint || 'Not recorded'}.
Presenting Symptoms: ${(dischargePatient.savedSymptoms || []).map(s => s.name).join(', ') || 'Not recorded'}.
Doctor's Manual History (Chief Complaint/HPI): ${dischargePatient.savedManualHistory || 'Not recorded'}.
Negative History: ${(dischargePatient.savedNegativeHistory || []).join(', ') || 'None confirmed'}.
Examination Findings on Admission: ${dischargePatient.savedExamValues ? Object.entries(dischargePatient.savedExamValues).map(([k,v]) => `${k}: ${v}`).join(', ') : 'Not documented'}.
Investigations Ordered: ${(dischargePatient.savedInvestigations || []).join(', ') || 'None'}.
Lab Results: ${dischargePatient.labResults || 'Not recorded'}.
Admission Date & Time: ${admissionStr}.
Discharge Date & Time: ${dischargeStr}.
Admission Vitals: ${admissionVitalsStr}.
Latest/Discharge Vitals: ${vitalsStr}.
Final Diagnosis: ${(dischargePatient.diagnoses || []).join(', ') || 'Not recorded'}.
Day-wise Hospital Course:
${daysSummary || 'Not recorded'}
Discharge Outcome: ${dischargeOutcome}.
${consentStr}

Generate a complete, professional Discharge Summary including:
1. Chief Complaint & Presenting History (use the chief complaint, symptoms, and manual history given above)
2. Examination & Investigation Findings (brief summary of what was found on admission)
3. Final Diagnosis/Provisional Diagnosis
4. Brief Hospital Course (chronological narrative referencing the day-wise data)
5. [IF APPLICABLE - FOR OBGY / SURGICAL PATIENTS ONLY]: Include a dedicated subsection/section for "Procedure Summary" (detailing any surgeries performed, intraoperative findings, and procedure course) OR "Delivery Note & Outcome" (detailing the mode of delivery, date/time, fetal outcome, sex of the baby, Apgar scores, and condition of the mother). Skip this section if the patient is neither surgical nor OBGY.
5. Condition at Discharge (based on latest vitals and outcome)
7. Advice & Follow-up Instructions (in both English and Gujarati, clear and patient-friendly)
8. Red Flag Warning Signs (when to return to hospital immediately)

CRITICAL FORMATTING RULES:
- Do NOT restate the patient's name, UHID, age, gender, admission date/time, or discharge date/time anywhere in your output — these already appear in a separate header in the printed document, so repeating them creates duplication.
- Do NOT include a separate itemized medication table with dosages and durations — the full medication table is printed separately as a dedicated table in the document. You may mention medication names briefly in the Hospital Course narrative only if clinically relevant (e.g. "started on IV antibiotics"), but do not list dosage/duration for each drug.
- Start your response directly with the "Chief Complaint & Presenting History" section heading — no greeting, no patient info block at the top.

Keep the tone formal, clinical, and concise. Return ONLY the discharge summary as plain readable text (not JSON, no markdown fences), formatted with clear section headings.
`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [
            { role: 'system', content: 'You are an expert clinical documentation assistant. Return only plain text, no JSON, no markdown code fences.' },
            { role: 'user', content: promptText }
          ],
        }),
      });

      if (!response.ok) {
        setDischargeSummaryError(`Server error: ${response.status} ${response.statusText}`);
        setDischargeSummaryLoading(false);
        return;
      }

      const data = await response.json();
      const resultText = data.choices?.[0]?.message?.content;
      if (resultText) {
        setDischargeSummary(resultText.trim());
      } else {
        setDischargeSummaryError('AI Engine returned an empty discharge summary.');
      }
    } catch (error) {
      console.error('Discharge Summary AI Error:', error);
      setDischargeSummaryError('Failed to generate discharge summary. Please try again.');
    } finally {
      setDischargeSummaryLoading(false);
    }
  };

  const confirmDischargeAndSendToPharmacy = () => {
    if (!dischargePatient) return;
    const dischargedAt = new Date().toISOString();
    const consent = ['LAMA', 'DAMA', 'Referred', 'Death / Expired'].includes(dischargeOutcome)
        ? { name: consentGiverName, relation: consentRelation, mobile: consentMobile, reason: consentReason }
        : {};

    setPatients(prev => prev.map(pt => pt.id === dischargePatient.id
        ? { ...pt, status: 'Pharmacy', dischargedAt, dischargeOutcome, dischargeConsent: consent, dischargeSummary }
        : pt
    ));

    updatePatientInDb(dischargePatient.dbId, {
      status: 'Pharmacy',
      discharged_at: dischargedAt,
      discharge_outcome: dischargeOutcome,
      discharge_consent: consent,
      discharge_summary: dischargeSummary,
    });

    setShowDischargeModal(false);
    setDischargePatient(null);
  };

  const printDischargeSummary = (patient) => {
    const admissionStr = patient.admittedAt ? new Date(patient.admittedAt).toLocaleString('en-IN') : 'Not recorded';
    const dischargeStr = patient.dischargedAt ? new Date(patient.dischargedAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN');
    const lastDay = (patient.dailyOrders || [])[(patient.dailyOrders || []).length - 1];
    const meds = lastDay?.meds || [];
    const medsHtml = meds.map(m => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #ddd;">${m.name}</td>
        <td style="padding:8px;border-bottom:1px solid #ddd;">${m.dosage}</td>
        <td style="padding:8px;border-bottom:1px solid #ddd;">${m.duration}</td>
      </tr>
    `).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Discharge Summary - ${patient.name}</title></head>
      <body style="font-family: Arial, sans-serif; padding: 30px;">
        <div style="text-align:center; border-bottom:2px solid #333; padding-bottom:10px; margin-bottom:20px;">
          <h2 style="margin:0;">${hospitalInfo.name}</h2>
          <p style="margin:2px 0; font-size:13px;">${hospitalInfo.address}</p>
          <p style="margin:2px 0; font-size:13px;">${hospitalInfo.doctorName}</p>
        </div>
        <p><b>Patient:</b> ${patient.name} | <b>UHID:</b> ${patient.uhid} | <b>Age/Sex:</b> ${patient.age}/${patient.gender}</p>
        <p><b>Admission:</b> ${admissionStr} &nbsp;|&nbsp; <b>Discharge:</b> ${dischargeStr}</p>
        <p><b>Discharge Outcome:</b> ${patient.dischargeOutcome || '-'}</p>
        <hr/>
        <h3>Discharge Summary</h3>
        <div style="white-space:pre-wrap; font-size:14px; line-height:1.6;">${(patient.dischargeSummary || 'Not generated').replace(/</g,'&lt;')}</div>
        <h3>Discharge Medications</h3>
        <table style="width:100%; border-collapse:collapse;">
          <thead><tr style="background:#eee; text-align:left;"><th style="padding:8px;">Medicine</th><th style="padding:8px;">Dosage</th><th style="padding:8px;">Duration</th></tr></thead>
          <tbody>${medsHtml || '<tr><td colspan="3" style="padding:8px;">None</td></tr>'}</tbody>
        </table>
        <br/><br/>
     
     <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:30px;">
 
 <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:30px;">
  <p style="margin:0;">Nurse's Signature: __________________</p>
  <div style="text-align:center;">
    ${hospitalInfo.doctorSign ? `<img src="${hospitalInfo.doctorSign}" alt="Sign" style="height:45px; object-fit:contain; display:block; margin:0 auto;" />` : `<p style="margin:0;">__________________</p>`}
    <p style="margin:4px 0 0 0; font-weight:bold;">${hospitalInfo.doctorName || "Doctor's Signature"}</p>
  </div>
</div>

      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const IPD_DEFAULT_VITALS = { bp: '120/80', pulse: '78', temp: '98.6', spo2: '98' };


  const handleIpdVitalInputChange = (patientId, field, value) => {
    setIpdVitalInputs(prev => ({
      ...prev,
      [patientId]: { ...(prev[patientId] || {}), [field]: value },
    }));
  };

  const saveIpdDayVitals = (patient) => {
    const activeDay = getActiveIpdDay(patient);
    if (!activeDay) return;
    const refs = ipdVitalRefs.current[patient.id] || {};
    const defaultTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const timeVal = refs.time?.value?.trim();
    const bpVal = refs.bp?.value?.trim();
    const pulseVal = refs.pulse?.value?.trim();
    const tempVal = refs.temp?.value?.trim();
    const spo2Val = refs.spo2?.value?.trim();

    const newReading = {
      id: Date.now() + Math.random(),
      time: timeVal || defaultTime,
      bp: bpVal || IPD_DEFAULT_VITALS.bp,
      pulse: pulseVal || IPD_DEFAULT_VITALS.pulse,
      temp: tempVal || IPD_DEFAULT_VITALS.temp,
      spo2: spo2Val || IPD_DEFAULT_VITALS.spo2,
    };

    const updatedDays = (patient.dailyOrders || []).map(d =>
        d.id === activeDay.id ? { ...d, vitalsLog: [...(d.vitalsLog || []), newReading] } : d
    );
    saveIpdDailyOrders(patient, updatedDays);

    // Input fields khali kari do (uncontrolled, DOM direct clear)
    ['time', 'bp', 'pulse', 'temp', 'spo2'].forEach(f => {
      if (refs[f]) refs[f].value = '';
    });
  };

  const addIpdInvestigation = (patient) => {
    const text = (ipdInvestigationInputs[patient.id] || '').trim();
    if (!text) return;
    const current = patient.investigationsOrdered || [];
    if (current.includes(text)) return;
    const updated = [...current, text];
    const cat = getTestCategory(text);
    const isRadiology = cat === 'Radiology';

    const localPatch = {
      investigationsOrdered: updated,
      labStatus: 'Pending',
      ...(isRadiology ? { radiologyDone: false } : { diagLabDone: false }),
    };
    const dbPatch = {
      investigations_ordered: updated,
      lab_status: 'Pending',
      ...(isRadiology ? { radiology_done: false } : { diag_lab_done: false }),
    };

    setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, ...localPatch } : p));
    updatePatientInDb(patient.dbId, dbPatch);
    setIpdInvestigationInputs(prev => ({ ...prev, [patient.id]: '' }));
  };

  const removeIpdInvestigation = (patient, item) => {
    const updated = (patient.investigationsOrdered || []).filter(i => i !== item);
    setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, investigationsOrdered: updated } : p));
    updatePatientInDb(patient.dbId, { investigations_ordered: updated });
  };


  const finishConsultation = () => {
    if (!activePatient) return;
    const ivIndicated = aiRouteOfCare === 'IPD' || requiresIVAdmission(prescriptions, nonPharmManagement.filter(i => i.type === 'Procedure'));
    const finalRoute = routeOverride ? routeOverride : (ivIndicated ? 'IPD' : 'OPD');
    const nextStatus = finalRoute === 'IPD' ? 'IPD' : 'Pharmacy';

    // If going to IPD, seed Day 1 of dailyOrders with everything the doctor already entered
    // (AI-suggested + manually added meds, non-pharm advice, and procedures), but only if
    // this patient doesn't already have day-wise orders (avoid overwriting an existing IPD stay).
    let dailyOrdersPatch = activePatient.dailyOrders || [];
    const admittedAtPatch = (nextStatus === 'IPD' && !activePatient.admittedAt) ? new Date().toISOString() : activePatient.admittedAt;
    if (nextStatus === 'IPD' && dailyOrdersPatch.length === 0 && (prescriptions.length > 0 || nonPharmManagement.length > 0 || followUpAdvice.trim())) {
      const day1Meds = prescriptions.map(m => ({
        id: m.id || Date.now() + Math.random(),
        name: m.name,
        dosage: m.dosage,
        duration: m.duration,
        note: m.note || '',
      }));
      const day1Advice = [
        ...nonPharmManagement.filter(item => item.type === 'Advice').map(item => ({
          id: Date.now() + Math.random(),
          text: item.text,
        })),
        ...(followUpAdvice.trim() ? [{ id: Date.now() + Math.random(), text: followUpAdvice.trim() }] : []),
      ];
      const day1Procedures = nonPharmManagement.filter(item => item.type === 'Procedure').map(item => ({
        id: Date.now() + Math.random(),
        text: item.text,
      }));
      dailyOrdersPatch = [{ id: `day-${Date.now()}`, label: 'Day 1', date: new Date().toLocaleDateString('en-GB'), meds: day1Meds, advice: day1Advice, procedures: day1Procedures, vitalsLog: [] }];
    }

    setPatients(patients.map(p => {
      if (p.id === activePatient.id) {
        return {
          ...p,
          status: nextStatus,
          diagnoses: acceptedDiagnosis,
          prescriptions: prescriptions,
          nonPharmManagement: nonPharmManagement,
          followUpAdvice: followUpAdvice,
          dailyOrders: dailyOrdersPatch,
          admittedAt: admittedAtPatch,
        };
      }
      return p;
    }));
    updatePatientInDb(activePatient.dbId, {
      status: nextStatus,
      diagnoses: acceptedDiagnosis,
      prescriptions: prescriptions,
      daily_orders: dailyOrdersPatch,
      non_pharm_management: nonPharmManagement,
      follow_up_advice: followUpAdvice,
      admitted_at: admittedAtPatch,
    });

    setSelectedPatientId(null);
    setActiveTab(nextStatus === 'IPD' ? 'ipd' : 'pharmacy');

    setPrescriptions([]);          // પ્રિસ્ક્રિપ્શન લિસ્ટ ખાલી કરો
    setNonPharmManagement([]);     // નોન-ફાર્માકોલોજિકલ મેનેજમેન્ટ ખાલી કરો
    setFollowUpAdvice("");         // ફોલો-અપ એડવાઈઝ ખાલી કરો
    setAcceptedDiagnosis([]);      // જો ડાયગ્નોસિસ પણ ખાલી કરવું હોય તો
    setRouteOverride(null);        // રૂટ ઓવરરાઈડ રીસેટ કરો
  };


    // --- Pharmacy Actions ---
    const dispenseMedication = (patientId) => {
      setPatients(patients.map(p => {
        if (p.id === patientId) {
          return {...p, status: 'Discharged'};
        }
        return p;
      }));
    };

  const updateStock = async (id, newStock) => {
    const stockValue = parseInt(newStock) || 0;
    setInventory(inventory.map(item =>
        item.id === id ? { ...item, stock: stockValue } : item
    ));
    setEditingStockId(null);
    setStockInput("");
    const { error } = await supabase.from('inventory').update({ stock: stockValue }).eq('id', id);
    if (error) console.error('Inventory update failed:', error);
  };

  const addNewMedicine = async () => {
    if (!newMedName.trim() || !currentRole?.hospitalId) return;
    const { data: inserted, error } = await supabase.from('inventory').insert({
      hospital_id: currentRole.hospitalId,
      name: newMedName.trim(),
      stock: parseInt(newMedStock) || 0,
      lowStockThreshold: 30,
    }).select().single();
    if (error) { alert('Could not add medicine: ' + error.message); return; }
    setInventory([...inventory, inserted]);
    setNewMedName("");
    setNewMedStock("");
  };

    const printPrescription = (patient) => {

      const adviceHtml = (patient.nonPharmManagement || [])
          .filter(item => item.type === 'Advice')
          .map(item => `<li style="margin-bottom:4px;">${item.text}</li>`)
          .join('');
      const procedureHtml = (patient.nonPharmManagement || [])
          .filter(item => item.type === 'Procedure')
          .map(item => `<li style="margin-bottom:4px;">${item.text}</li>`)
          .join('');

      const medsHtml = (patient.prescriptions || []).map(m => `
        <tr>
            <td style="padding:8px;border-bottom:1px solid #ddd;">${m.name}</td>
            <td style="padding:8px;border-bottom:1px solid #ddd;">${m.dosage}</td>
            <td style="padding:8px;border-bottom:1px solid #ddd;">${m.duration}</td>
            <td style="padding:8px;border-bottom:1px solid #ddd;">${m.note || '-'}</td>
        </tr>
    `).join('');

      // ડેટાને સુરક્ષિત રીતે ફોર્મેટ કરવા માટેના વેરિયેબલ્સ
      const symptomsStr = (patient.savedSymptoms && patient.savedSymptoms.length > 0)
          ? patient.savedSymptoms.map(s => s.name).join(', ')
          : 'N/A';

      const negHistoryStr = (patient.savedNegativeHistory && patient.savedNegativeHistory.length > 0)
          ? patient.savedNegativeHistory.join(', ')
          : 'None';

      const examsStr = patient.savedExamValues
          ? Object.entries(patient.savedExamValues).map(([k, v]) => k + ': ' + v).join(', ')
          : 'Normal';

      const diagStr = (patient.diagnoses && patient.diagnoses.length > 0)
          ? patient.diagnoses.join(', ')
          : 'N/A';

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
        <head><title>Prescription - ${patient.name}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 30px;">
            <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
                <h2 style="margin:0;">${hospitalInfo.name}</h2>
                <p style="margin:2px 0; font-size:13px;">${hospitalInfo.address}</p>
                <p style="margin:2px 0; font-size:13px;">${hospitalInfo.doctorName} </p>
                <p style="margin:2px 0; font-size:13px;">${hospitalInfo.email}&nbsp;|&nbsp; Contact: ${hospitalInfo.contact}</p>
            </div>
            
            <p style="text-align: left;"><b>Patient:</b> ${patient.name}&nbsp;&nbsp;|&nbsp;&nbsp;<b>UHID:</b> ${patient.uhid}&nbsp;&nbsp;|&nbsp;&nbsp;<b>Age/Sex:</b> ${patient.age} / ${patient.gender}</p>
 <p style="margin:4px 0; font-size:13px;"><b>Date:</b> ${new Date().toLocaleDateString('en-GB')}</p>

<p style="margin:2px 0; font-size:13px;">${patient.address || ''}${patient.contact ? ' &nbsp;|&nbsp; Contact: ' + patient.contact : ''}${patient.insuranceId ? ' &nbsp;|&nbsp; Insurance ID: ' + patient.insuranceId : ''}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
            
            <div style="margin-bottom: 20px; text-align: left;">
                <h4 style="margin:0 0 5px 0; color:#333;">CLINICAL SUMMARY</h4>
                <p style="margin:2px 0; font-size:14px;"><b>Occupation:</b> ${patient.occupation} </p>
                <p style="margin:2px 0; font-size:14px;"><b>Symptoms:</b> ${symptomsStr}</p>
                <p style="margin:2px 0; font-size:14px;"><b>Negative History:</b> ${negHistoryStr}</p>
                <p style="margin:2px 0; font-size:14px;"><b>Examinations:</b> ${examsStr || 'Normal Value'}</p>
                <p style="margin:2px 0; font-size:14px;"><b>Lab Results:</b> ${patient.labResults || 'Pending / None'}</p>
            </div>

            <div style="margin-bottom: 20px; text-align: left;">
                <h4 style="margin:0 0 5px 0; color:#333;">DIAGNOSIS</h4>
                <p style="margin:2px 0; font-size:14px; font-weight:bold;">${diagStr}</p>
            </div>
            
            <h4 style="margin:0 0 10px 0; color:#333; text-align: left;">PRESCRIPTION (Rx)</h4>
            
            <table style="width:100%; border-collapse:collapse; margin-top:20px;">
                <thead>
                    <tr style="background:#eee; text-align:left;">
                        <th style="padding:8px;">Medicine</th>
                        <th style="padding:8px;">Dosage</th>
                        <th style="padding:8px;">Duration</th>
                        <th style="padding:8px;">Note</th>
                    </tr>
                </thead>
                <tbody>${medsHtml}</tbody>
            </table>
         ${adviceHtml ? `
<div style="margin-top: 20px;">
    <h4 style="margin:0 0 8px 0; color:#333;">NON-PHARMACOLOGICAL ADVICE</h4>
    <ul style="padding-left: 18px; font-size: 13px;">${adviceHtml}</ul>
</div>` : ''}
${procedureHtml ? `
<div style="margin-top: 15px;">
    <h4 style="margin:0 0 8px 0; color:#333;">PROCEDURAL MANAGEMENT</h4>
    <ul style="padding-left: 18px; font-size: 13px;">${procedureHtml}</ul>
</div>` : ''}
${patient.followUpAdvice ? `

        
<div style="margin-top: 15px;">
    <h4 style="margin:0 0 8px 0; color:#333;">ADVICE & FOLLOW-UP</h4>
    <p style="font-size:13px; margin:0;">${patient.followUpAdvice}</p>
</div>` : ''}
<br/><br/>
<p style="text-align:right;">Doctor's Signature: ___________________</p>
            
        </body>
        </html>
    `);
      printWindow.document.close();
      printWindow.print();
    };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginUsername, // staff log in with their email now
      password: loginPassword,
    });
    if (error) { setLoginError('Invalid username or password'); return; }
    await loadProfile(data.user.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentRole(null);
    setLoginUsername('');
    setLoginPassword('');
    localStorage.removeItem('medflow_loggedIn');
    localStorage.removeItem('medflow_role');
  };

  const deletePatient = async (patient) => {
    if (!window.confirm(`Delete patient "${patient.name}" (${patient.uhid})? This cannot be undone.`)) return;
    const { error } = await supabase.from('patients').delete().eq('id', patient.dbId);
    if (error) { alert('Could not delete patient: ' + error.message); return; }
    setPatients(prev => prev.filter(p => p.id !== patient.id));
  };

    const SidebarItem = ({icon: Icon, label, id, step}) => (
        <button onClick={() => setActiveTab(id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${activeTab === id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
          <div
              className={`w-6 h-6 rounded flex items-center justify-center mr-3 text-xs ${activeTab === id ? 'bg-blue-500' : 'bg-slate-700'}`}>{step}</div>
          <Icon size={16} className="mr-2"/>
          {label}
        </button>
    );

  if (!isLoggedIn) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-100 font-sans">
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">MedFlow AI</h2>
              <p className="text-sm text-gray-500">Sign in to continue</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase">Username</label>
              <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm mt-1"
                  placeholder="e.g. doctor"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase">Password</label>
              <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm mt-1"
                  placeholder="••••••••"
              />
            </div>
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">
              Sign In
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              Demo: admin/admin123, reception/reception123, nurse/nurse123, doctor/doctor123, ipd/ipd123, lab/lab123, pharmacy/pharmacy123
            </p>
          </form>
        </div>
    );
  }
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
          {/* Sidebar */}
          <div className="w-64 bg-[#1e2330] flex flex-col justify-between text-white flex-shrink-0 shadow-lg z-10 md:flex">
            <div className="p-4 flex items-center space-x-3 border-b border-slate-700">
              <Activity className="text-blue-400 w-6 h-6"/>
              <div>
                <h1 className="font-bold text-lg leading-tight">MedFlow AI</h1>
                <p className="text-xs text-slate-400"> AI Hospital Made by dr.Ram PR</p>
              </div>
            </div>
            <div className="flex-1 py-4 space-y-1">
              {currentRole?.tabs?.includes('reception') && (
                  <SidebarItem step="1" icon={Users} label="Reception" id="reception" />
              )}
              {currentRole?.tabs?.includes('nursing') && (
                  <SidebarItem step="2" icon={HeartPulse} label="Nursing Station" id="nursing" />
              )}
              {currentRole?.tabs?.includes('doctor') && (
                  <SidebarItem step="3" icon={Stethoscope} label="MO Consultation" id="doctor" />
              )}
              {currentRole?.tabs?.includes('ipd') && (
                  <SidebarItem step="3b" icon={BedDouble} label="IPD Ward" id="ipd" />
              )}
              {currentRole?.tabs?.includes('lab') && (
                  <SidebarItem step="4" icon={FlaskConical} label="Laboratory" id="lab" />
              )}
              {currentRole?.tabs?.includes('pharmacy') && (
                  <SidebarItem step="5" icon={Pill} label="Pharmacy" id="pharmacy" />
              )}
              {currentRole?.tabs?.includes('settings') && (
                  <SidebarItem step="6" icon={Settings} label="Settings" id="settings"/>
              )}
            </div>
            <div className="p-4 border-t border-slate-700 mt-auto">
              <div className="text-xs text-slate-400 mb-2">Logged in as: <span className="font-semibold text-white">{currentRole?.fullName}</span></div>
              <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white text-sm py-2 rounded-lg font-semibold"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header className="h-14 bg-white border-b flex items-center justify-between px-4 md:px-6 shadow-sm z-10">
              <div className="flex items-center">
                {/* Mobile menu button */}
                <Activity className="text-blue-600 w-5 h-5 mr-3 md:hidden"/>
                <h2 className="font-semibold text-gray-800 flex items-center uppercase tracking-wide text-xs md:text-sm">
                  {activeTab === 'reception' && "Reception - Patient Registration"}
                  {activeTab === 'nursing' && "Nursing Station - Vitals & Triage"}
                  {activeTab === 'doctor' && "MO Consultation (Doctor's Desk)"}
                  {activeTab === 'ipd' && "IPD Ward — Admitted Patients"}
                  {activeTab === 'lab' && "Laboratory Section"}
                  {activeTab === 'review' && "Final Review Section"}
                  {activeTab === 'pharmacy' && "Pharmacy Dispensing"}
                </h2>
              </div>
              <div className="text-xs md:text-sm text-gray-500 hidden sm:block">Sat, 25 Jul, 2026 • General Hospital
              </div>
            </header>

            <main className="flex-1 overflow-auto p-4 md:p-6 bg-[#f8fafc]">

              {/* --- RECEPTION TAB --- */}
              {activeTab === 'reception' && (
                  <div className="max-w-5xl mx-auto space-y-6">
                    <div
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border shadow-sm gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">OPD Patient Registration</h3>
                        <p className="text-xs text-gray-500">Register incoming patients and route them to Nursing
                          Station for triage.</p>
                      </div>
                      <button
                          onClick={() => setShowAddPatientModal(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 shadow-sm w-full sm:w-auto justify-center"
                      >
                        <Plus size={16}/> Register New Patient
                      </button>
                    </div>
                    <div className="bg-white p-3 rounded-xl border shadow-sm flex items-center gap-2">
                      <Search size={16} className="text-gray-400 shrink-0"/>
                      <input
                          type="text"
                          value={receptionSearch}
                          onChange={(e) => setReceptionSearch(e.target.value)}
                          placeholder="Search by UHID or patient name..."
                          className="w-full outline-none text-sm"
                      />
                    </div>
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden overflow-x-auto">

                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                        <tr className="bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <th className="p-4">UHID</th>
                          <th className="p-4">Patient Name</th>
                          <th className="p-4">Age / Gender</th>
                          <th className="p-4">Occupation</th>
                          <th className="p-4">Address</th>
                          <th className="p-4">Triage</th>
                          <th className="p-4">Current Status</th>
                          <th className="p-4">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                        {patients.filter(p => p.status !== 'Discharged' && matchesSearch(p, receptionSearch)).map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                              <td className="p-4 font-semibold text-blue-600 whitespace-nowrap">{p.uhid}</td>
                              <td className="p-4 font-medium text-gray-900">{p.name}</td>
                              <td className="p-4 whitespace-nowrap">{p.age} / <span
                                  className="capitalize">{p.gender}</span></td>
                              <td className="p-4 text-gray-600 max-w-[200px] truncate">{p.occupation}</td>
                              <td className="p-4 text-gray-600 max-w-[200px] truncate">{p.address || '-'}</td>
                              <td className="p-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                              p.triage === 'RED' ? 'bg-red-100 text-red-700 border border-red-200' :
                                  p.triage === 'YELLOW' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                      'bg-green-100 text-green-700 border border-green-200'
                          }`}>
                            {p.triage}
                          </span>
                              </td>
                              <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              p.status === 'Nursing' ? 'bg-orange-100 text-orange-700' :
                                  p.status === 'Doctor' ? 'bg-indigo-100 text-indigo-700' :
                                      p.status === 'IPD' ? 'bg-red-100 text-red-700' :
                                      p.status === 'Pharmacy' ? 'bg-purple-100 text-purple-700' :
                                          'bg-slate-100 text-slate-800'
                          }`}>
                            {p.status}
                          </span>
                              </td>

                              <td className="p-4">
                                {p.status === 'Nursing' && (
                                    <button
                                        onClick={() => deletePatient(p)}
                                        className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50"
                                        title="Delete mistaken registration"
                                    >
                                      <Trash2 size={16}/>
                                    </button>
                                )}
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Add Patient Modal */}
                    {showAddPatientModal && (
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                          <div
                              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold text-gray-900">New Registration</h3>

                              <button onClick={() => {
                                setShowAddPatientModal(false);
                                setFollowUpUhid('');
                                setFollowUpPreview(null);
                                setNewPatientName('');
                                setNewPatientAge('');
                                setNewPatientGender('male');
                                setNewPatientAddress('');
                                setNewPatientOccupation('');
                                setNewPatientInsuranceId('');
                                setNewPatientContact('');
                              }}
                                      className="text-gray-400 hover:text-gray-600">
                                <Trash2 size={20} className="hidden"/>
                              </button>
                            </div>

                            <form onSubmit={handleAddPatient} className="space-y-4">
                              <div>
                                <div className="mb-3">
                                  <label className="text-sm font-medium text-gray-700">Existing UHID (for follow-up patient)</label>
                                  <input
                                      type="text"
                                      placeholder="UHID (EHR100001) or patient name"
                                      value={followUpUhid}
                                      onChange={(e) => {
                                        setFollowUpUhid(e.target.value);
                                        searchFollowUpPatient(e.target.value);
                                      }}
                                      className="w-full border rounded p-2 text-sm mt-1"
                                  />
                                  <p className="text-xs text-gray-400 mt-1">Leave blank for a new patient</p>

                                  {followUpPreview && (
                                      <div className={`mt-2 rounded-lg border p-3 text-xs ${followUpPreview.isDischarged ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                                        <div className="flex items-center justify-between mb-1.5">
                                          <span className={`font-bold uppercase tracking-wide ${followUpPreview.isDischarged ? 'text-amber-700' : 'text-green-700'}`}>
                                            {followUpPreview.isDischarged ? '⚠ Previously Discharged Patient' : '✓ Active Patient Found'}
                                          </span>
                                          {followUpPreview.lastVisitDate && (
                                              <span className="text-gray-400">{followUpPreview.lastVisitDate}</span>
                                          )}
                                        </div>
                                        {followUpPreview.diagnoses && (
                                            <p className="text-gray-700 mb-1"><b>Last Diagnosis:</b> {followUpPreview.diagnoses}</p>
                                        )}
                                        {followUpPreview.dischargeOutcome && (
                                            <p className="text-gray-700 mb-1"><b>Discharge Outcome:</b> {followUpPreview.dischargeOutcome}</p>
                                        )}
                                        {followUpPreview.dischargeSummary ? (
                                            <details className="mt-1">
                                              <summary className="cursor-pointer font-semibold text-amber-700">View Previous Discharge Summary</summary>
                                              <p className="text-gray-600 whitespace-pre-wrap mt-1 max-h-40 overflow-y-auto">{followUpPreview.dischargeSummary}</p>
                                            </details>
                                        ) : (
                                            followUpPreview.isDischarged && (
                                                <p className="text-gray-400 italic">No discharge summary recorded for last visit.</p>
                                            )
                                        )}
                                      </div>
                                  )}
                                </div>
                                <label
                                    className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Full
                                  Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newPatientName}
                                    onChange={e => setNewPatientName(e.target.value)}
                                    placeholder="e.g., Rajesh Sharma"
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label
                                      className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Age</label>
                                  <input
                                      type="number"
                                      required
                                      value={newPatientAge}
                                      onChange={e => setNewPatientAge(e.target.value)}
                                      placeholder="Years"
                                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                  />
                                </div>
                                <div>
                                  <label
                                      className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Gender</label>
                                  <select
                                      value={newPatientGender}
                                      onChange={e => setNewPatientGender(e.target.value)}
                                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                  >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label
                                    className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Triage
                                  Priority</label>
                                <select
                                    value={newPatientTriage}
                                    onChange={e => setNewPatientTriage(e.target.value)}
                                    className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                                        newPatientTriage === 'RED' ? 'bg-red-50 border-red-200 text-red-900' :
                                            newPatientTriage === 'YELLOW' ? 'bg-yellow-50 border-yellow-200 text-yellow-900' :
                                                'bg-green-50 border-green-200 text-green-900'
                                    }`}
                                >
                                  <option value="GREEN">GREEN - Non-Urgent</option>
                                  <option value="YELLOW">YELLOW - Urgent</option>
                                  <option value="RED">RED - Emergency</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Address</label>
                                <input
                                    type="text"
                                    value={newPatientAddress}
                                    onChange={e => setNewPatientAddress(e.target.value)}
                                    placeholder="e.g., Village, Taluka, District"
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Contact Number</label>
                                  <input
                                      type="text"
                                      value={newPatientContact}
                                      onChange={e => setNewPatientContact(e.target.value)}
                                      placeholder="10-digit mobile"
                                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Insurance ID</label>
                                  <input
                                      type="text"
                                      value={newPatientInsuranceId}
                                      onChange={e => setNewPatientInsuranceId(e.target.value)}
                                      placeholder="Policy / Insurance ID (optional)"
                                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                    className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Occupation</label>
                                <textarea
                                    required
                                    value={newPatientOccupation}
                                    onChange={e => setNewPatientOccupation(e.target.value)}
                                    placeholder="Brief occupation..."
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                ></textarea>
                              </div>

                              <div className="flex items-center gap-3 pt-2">

                                <button
                                    type="button"

                                    onClick={() => {
                                      setShowAddPatientModal(false);
                                      setFollowUpUhid('');
                                      setFollowUpPreview(null);
                                      setNewPatientName('');
                                      setNewPatientAge('');
                                      setNewPatientGender('male');
                                      setNewPatientAddress('');
                                      setNewPatientOccupation('');
                                      setNewPatientInsuranceId('');
                                      setNewPatientContact('');
                                    }}
                                    className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingPatient}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isSubmittingPatient ? 'Registering...' : 'Register Patient'}
                                </button>

                              </div>
                            </form>
                          </div>
                        </div>
                    )}
                  </div>
              )}


              {/* --- NURSING STATION TAB --- */}
              {activeTab === 'nursing' && (
                  <div className="max-w-5xl mx-auto space-y-6">
                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                      <h3 className="text-lg font-bold text-gray-800">Nursing Station</h3>
                      <p className="text-xs text-gray-500">Record vitals and assess patients before forwarding to the
                        Medical Officer.</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border shadow-sm flex items-center gap-2">
                      <Search size={16} className="text-gray-400 shrink-0"/>
                      <input
                          type="text"
                          value={nursingSearch}
                          onChange={(e) => setNursingSearch(e.target.value)}
                          placeholder="Search by UHID or patient name..."
                          className="w-full outline-none text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {patients.filter(p => p.status === 'Nursing' && matchesSearch(p, nursingSearch)).length === 0 ? (
                          <div

                              className="col-span-full bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                            <ActivitySquare className="w-12 h-12 mx-auto text-gray-300 mb-3"/>
                            <p className="font-medium">No patients currently at the Nursing Station.</p>
                            <p className="text-xs mt-1">Patients registered at Reception will appear here.</p>
                          </div>
                      ) : (
                          patients.filter(p => p.status === 'Nursing' && matchesSearch(p, nursingSearch)).map(p => (
                              <div key={p.id}
                                   className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                                <div
                                    className={`p-4 border-b flex justify-between items-center ${p.triage === 'RED' ? 'bg-red-50' : p.triage === 'YELLOW' ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-gray-900 text-lg">{p.name}</h4>
                                      <span
                                          className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded border">{p.uhid}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{p.age} • {p.gender} • <span
                                        className="font-medium text-gray-800">{p.occupation}</span></p>
                                  </div>
                                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                      p.triage === 'RED' ? 'bg-red-100 text-red-700 border-red-200' :
                                          p.triage === 'YELLOW' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                              'bg-green-100 text-green-700 border-green-200'
                                  }`}>
                          {p.triage}
                        </span>
                                </div>

                                <div className="p-5 flex-1">
                                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Record
                                    Vitals</h5>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Blood Pressure
                                        (mmHg)</label>
                                      <input
                                          type="text"
                                          placeholder="120/80"
                                          value={vitalInputs[p.id]?.bp || ''}
                                          onChange={(e) => handleVitalsChange(p.id, 'bp', e.target.value)}
                                          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Heart Rate
                                        (bpm)</label>
                                      <input
                                          type="number"
                                          placeholder="72"
                                          value={vitalInputs[p.id]?.pulse || ''}
                                          onChange={(e) => handleVitalsChange(p.id, 'pulse', e.target.value)}
                                          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Temperature
                                        (°F)</label>
                                      <input
                                          type="number" step="0.1"
                                          placeholder="98.6"
                                          value={vitalInputs[p.id]?.temp || ''}
                                          onChange={(e) => handleVitalsChange(p.id, 'temp', e.target.value)}
                                          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">SpO2 (%)</label>
                                      <input
                                          type="number"
                                          placeholder="98"
                                          value={vitalInputs[p.id]?.spo2 || ''}
                                          onChange={(e) => handleVitalsChange(p.id, 'spo2', e.target.value)}
                                          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="p-4 bg-gray-50 border-t flex justify-end">
                                  <button
                                      onClick={() => forwardToDoctor(p.id)}
                                      className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
                                  >
                                    Send to Doctor <ArrowRight size={16}/>
                                  </button>
                                </div>
                              </div>
                          ))
                      )}
                    </div>
                  </div>
              )}



              {/* --- DOCTOR CONSULTATION TAB --- */}
              {activeTab === 'doctor' && (
                  <div className="flex flex-col h-full space-y-4">
                    {/* Doctor Header: Patient Selector */}
                    <div className="bg-white rounded-xl border shadow-sm p-3 flex items-center gap-2">
                      <Search size={16} className="text-gray-400 shrink-0"/>
                      <input
                          type="text"
                          value={doctorQueueSearch}
                          onChange={(e) => setDoctorQueueSearch(e.target.value)}
                          placeholder="Search queue by UHID or patient name..."
                          className="w-full outline-none text-sm"
                      />
                    </div>
                    <div
                        className="bg-white rounded-xl border shadow-sm p-3 flex flex-wrap gap-2 items-center overflow-x-auto">
                      <span className="text-xs font-semibold text-gray-500 uppercase px-2">Waiting:</span>
                      {patients.filter(p => p.status === 'Doctor' && matchesSearch(p, doctorQueueSearch)).length === 0 ? (
                          <span className="text-sm text-gray-500 italic">No matching patients in queue</span>
                      ) : (
                          patients.filter(p => p.status === 'Doctor' && matchesSearch(p, doctorQueueSearch)).map(p => (

                              <button
                                  key={p.id}
                                  onClick={() => setSelectedPatientId(p.id)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 whitespace-nowrap ${
                                      selectedPatientId === p.id
                                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                  }`}
                              >
                                <User size={14}
                                      className={selectedPatientId === p.id ? 'text-indigo-500' : 'text-gray-400'}/>
                                {p.name} {p.triage === 'RED' &&
                                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                              </button>
                          ))
                      )}
                    </div>

                    {activePatient ? (
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden min-h-0">
                          {/* Left Column: Patient Profile & Workflow Steps */}
                          <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-10 lg:pb-0">

                            {/* Active Patient Card */}
                            <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex-shrink-0">
                              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4 text-white">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-xl font-bold">{activePatient.name}</h3>
                                    <p className="text-indigo-100 text-sm mt-0.5">{activePatient.age} • {activePatient.gender} • {activePatient.uhid}</p>
                                  </div>
                                  <span
                                      className={`text-[10px] font-bold px-2 py-1 rounded bg-white/20 backdrop-blur-sm`}>
                            {activePatient.triage}
                          </span>
                                </div>
                              </div>

                              <div className="p-4 bg-gray-20 space-y-2">
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Occupation</h4>
                                  <p className="text-sm font-medium text-gray-800">{activePatient.occupation}</p>
                                </div>
                                {(activePatient.contact || activePatient.insuranceId) && (
                                    <div className="flex gap-6">
                                      {activePatient.contact && (
                                          <div>
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Contact</h4>
                                            <p className="text-sm font-medium text-gray-800">{activePatient.contact}</p>
                                          </div>
                                      )}
                                      {activePatient.insuranceId && (
                                          <div>
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Insurance ID</h4>
                                            <p className="text-sm font-medium text-gray-800">{activePatient.insuranceId}</p>
                                          </div>
                                      )}
                                    </div>
                                )}
                              </div>



                              {activePatient.vitals && (
                                  <div className="p-4 border-t grid grid-cols-2 gap-y-3 gap-x-2">
                                    <div>
                                      <p className="text-xs text-gray-500">Blood Pressure</p>
                                      <p className="font-semibold text-gray-800">{activePatient.vitals.bp} <span
                                          className="text-[10px] font-normal text-gray-400">mmHg</span></p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Heart Rate</p>
                                      <p className="font-semibold text-gray-800">{activePatient.vitals.pulse} <span
                                          className="text-[10px] font-normal text-gray-400">bpm</span></p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Temperature</p>
                                      <p className="font-semibold text-gray-800">{activePatient.vitals.temp} <span
                                          className="text-[10px] font-normal text-gray-400">°F</span></p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">SpO2</p>
                                      <p className="font-semibold text-gray-800">{activePatient.vitals.spo2} <span
                                          className="text-[10px] font-normal text-gray-400">%</span></p>
                                    </div>
                                  </div>
                              )}
                            </div>

                            {/* Stepper Navigation */}
                            <div className="bg-white rounded-xl border shadow-sm p-5 flex-shrink-0">
                              {[
                                { id: 'history',   label: 'History & Symptoms',     icon: ClipboardCheck },
                                { id: 'exams',     label: 'Exams & Investigations', icon: FlaskConical },
                                { id: 'findings',  label: 'Findings & Summary',      icon: FileText },
                                { id: 'diagnosis', label: 'Provisional Diagnosis',   icon: Stethoscope },
                                { id: 'plan',      label: 'Treatment Plan',          icon: Pill },
                              ].map((step, idx, arr) => {
                                const isActive = consultStep === step.id;
                                const isLast = idx === arr.length - 1;
                                return (
                                    <div key={step.id} className="flex flex-col">
                                      <button
                                          onClick={() => setConsultStep(step.id)}
                                          className="flex items-center gap-3 text-left py-1 w-full"
                                      >
                                        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                            isActive ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-gray-300 text-gray-400 bg-white'
                                        }`}>
                                          <step.icon size={16}/>
                                        </div>
                                        <span className={`text-sm ${isActive ? 'font-bold text-gray-900' : 'text-gray-400'}`}>
            {step.label}
          </span>
                                      </button>
                                      {!isLast && (
                                          <div className="w-9 flex justify-center">
                                            <div className="w-px h-6 bg-gray-200"/>
                                          </div>
                                      )}
                                    </div>
                                );
                              })}
                            </div>

                          </div>

                          {/* Right Column: Dynamic Content Area */}
                          <div
                              className="lg:col-span-3 bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden h-[600px] lg:h-auto">

                            {/* --- STEP 1: History & Symptoms --- */}
                            {consultStep === 'history' && (
                                <>
                                  <div className="flex border-b overflow-x-auto p-2 bg-gray-50 gap-2 hide-scrollbar">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSymptomFilter(cat)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                                symptomFilter === cat
                                                    ? 'bg-gray-800 text-white'
                                                    : 'bg-white border text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                          {cat}
                                        </button>
                                    ))}
                                  </div>

                                  <div className="flex-1 overflow-y-auto p-5">

                                    {activePatient?.visitHistory?.length > 0 && (
                                        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                                          <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">
                                            Previous Visit History ({activePatient.visitHistory.length})
                                          </h4>
                                          <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {activePatient.visitHistory.slice().reverse().map((visit, idx) => (
                                                <div key={idx} className="bg-white border border-amber-100 rounded-lg p-3">
                                                  <p className="text-xs text-gray-400 mb-1">
                                                    {new Date(visit.date).toLocaleDateString('en-GB')}
                                                  </p>
                                                  {visit.complaint && (
                                                      <p className="text-sm text-gray-700"><b>Complaint:</b> {visit.complaint}</p>
                                                  )}
                                                  {visit.diagnoses?.length > 0 && (
                                                      <p className="text-sm text-gray-700 mt-1"><b>Diagnosis:</b> {visit.diagnoses.join(', ')}</p>
                                                  )}
                                                  {visit.prescriptions?.length > 0 && (
                                                      <p className="text-sm text-gray-700 mt-1">
                                                        <b>Medications:</b> {visit.prescriptions.map(m => `${m.name} (${m.dosage}, ${m.duration})`).join('; ')}
                                                      </p>
                                                  )}
                                                  {visit.dischargeSummary && (
                                                      <details className="mt-1">
                                                        <summary className="text-xs text-amber-700 cursor-pointer font-semibold">View Discharge Summary</summary>
                                                        <p className="text-xs text-gray-600 whitespace-pre-wrap mt-1">{visit.dischargeSummary}</p>
                                                      </details>
                                                  )}
                                                </div>
                                            ))}
                                          </div>
                                        </div>
                                    )}

                                    <div className="mb-6">
                                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                        Clinical Images (for AI reference)
                                      </h4>

                                      <div className="flex flex-wrap gap-3">
                                        {clinicalImages.map(img => (
                                            <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                              <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                                              <button onClick={() => removeClinicalImage(img.id)}
                                                      className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
                                            </div>
                                        ))}
                                        <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-indigo-400 hover:text-indigo-500">
                                          <Plus size={18}/>
                                          <span className="text-[10px] mt-1">Gallery</span>
                                          <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                                        </label>
                                        <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-indigo-400 hover:text-indigo-500">
                                          <Camera size={18}/>
                                          <span className="text-[10px] mt-1">Camera</span>
                                          <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                      </div>
                                    </div>

                                    {selectedSymptoms.length > 0 && (
                                        <div className="mb-6">
                                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Selected Symptoms</h4>
                                          <div className="flex flex-wrap gap-2">
                                            {selectedSymptoms.map(sym => {
                                              const duration = symptomDurations[sym.id];
                                              const isOpen = openDurationFor === sym.id;
                                              return (
                                                  <span key={sym.id} className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-full text-sm">
                              {sym.name}
                                                    <button
                                                        onClick={() => setOpenDurationFor(isOpen ? null : sym.id)}
                                                        className="ml-1 text-xs px-2 py-0.5 rounded-full border border-dashed border-indigo-300 text-indigo-500 hover:border-indigo-500 hover:text-indigo-800"
                                                    >
                                {duration?.num ? `${duration.num} ${duration.unit}` : '+ duration'}
                              </button>
                                                    {isOpen && (
                                                        <span className="flex items-center gap-1 bg-white border border-indigo-200 rounded-lg px-2 py-1 ml-1">
                                    <input
                                        type="number"
                                        min="0"
                                        defaultValue={duration?.num ?? ''}
                                        className="w-12 text-sm border border-gray-300 rounded px-1"
                                        onChange={(e) => setDuration(sym.id, e.target.value, duration?.unit || 'Days')}
                                        autoFocus
                                    />
                                    <select
                                        value={duration?.unit || 'Days'}
                                        className="text-sm border border-gray-300 rounded px-1"
                                        onChange={(e) => setDuration(sym.id, duration?.num || '', e.target.value)}
                                    >
                                      {DURATION_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                    <button
                                        onClick={() => setOpenDurationFor(null)}
                                        className="text-xs text-gray-400 hover:text-gray-700 px-1"
                                    >
                                      &#10003;
                                    </button>
                                  </span>
                                                    )}
                                                    <button onClick={() => toggleSymptom(sym)} className="text-indigo-400 hover:text-indigo-800">
                                &times;
                              </button>
                            </span>
                                              );
                                            })}
                                          </div>
                                        </div>
                                    )}

                                    <div className="p-4 border-b bg-gray-50">
                                      <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                                          Manual History & Symptoms/Complaint
                                        </label>
                                        <button
                                            type="button"
                                            onClick={startVoiceInput}
                                            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${isListening ? 'bg-red-100 text-red-700 border-red-300 animate-pulse' : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-300'}`}
                                        >
                                          <Mic size={12}/> {isListening ? 'Listening...' : 'Voice Input'}
                                        </button>
                                      </div>

                                      <textarea
                                          value={manualHistory}
                                          onChange={(e) => setManualHistory(e.target.value)}
                                          placeholder='e.g. "Fever x 3 days, low grade, no chills. Worsening cough since yesterday."'
                                          rows={3}
                                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                      />
                                    </div>

                                    <input
                                        type="text"
                                        value={symptomSearch}
                                        onChange={(e) => setSymptomSearch(e.target.value)}
                                        placeholder="Search symptoms across all categories..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />

                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Available Symptoms</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {SYMPTOMS_DB
                                          .filter(s => {
                                            const matchesCategory = symptomFilter === 'All' || s.category === symptomFilter;
                                            const matchesSearch = symptomSearch.trim() === '' ||
                                                s.name.toLowerCase().includes(symptomSearch.toLowerCase());
                                            return matchesCategory && matchesSearch;
                                          }).map(sym => {
                                            const isSelected = selectedSymptoms.find(s => s.id === sym.id);
                                            return (
                                                <button
                                                    key={sym.id}
                                                    onClick={() => toggleSymptom(sym)}
                                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                                        isSelected
                                                            ? 'bg-indigo-50 border-indigo-300 text-indigo-800 shadow-sm ring-1 ring-indigo-200'
                                                            : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                  {sym.name}
                                                </button>
                                            );
                                          })}
                                    </div>
                                  </div>

                                  <div className="p-4 bg-white border-t flex justify-end">
                                    <button
                                        onClick={() => setConsultStep('exams')}
                                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm"
                                    >
                                      Next: Exams & Investigations <ArrowRight size={16}/>
                                    </button>
                                  </div>
                                </>
                            )}

                            {/* --- STEP 2: Exams & Investigations --- */}
                            {consultStep === 'exams' && (
                                <div className="flex-1 flex flex-col overflow-hidden">
                                  <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                    <div>
                                      <h3 className="font-bold text-gray-900 text-lg">Exams & Investigations</h3>
                                      <p className="text-xs text-gray-500">Get AI suggestions, then confirm what applies.</p>
                                    </div>
                                    <button
                                        onClick={runExamSuggestionEngine}
                                        disabled={aiExamLoading}
                                        className="bg-white border border-indigo-300 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 disabled:opacity-50 flex items-center gap-2"
                                    >
                                      <Sparkles size={16}/> {aiExamLoading ? 'Suggesting...' : 'Suggest Examination & Investigations'}
                                    </button>
                                  </div>

                                  <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                    {aiExamError && (
                                        <p className="text-sm text-red-600">{aiExamError}</p>
                                    )}

                                    {!examSuggestions && !aiExamLoading && (
                                        <div className="flex flex-col items-center justify-center text-gray-400 py-10 space-y-3">
                                          <FlaskConical size={32} className="opacity-50"/>
                                          <p className="text-sm">Run the suggestion engine above to get started.</p>
                                        </div>
                                    )}

                                    {examSuggestions?.negativeHistory?.length > 0 && (
                                        <div>
                                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            Negative History — tap "Present" if symptom exists, "Ruled Out" if patient denies it
                                          </h4>
                                          <div className="flex flex-wrap gap-2">
                                            {examSuggestions.negativeHistory.map((item, i) => {
                                              const answer = negativeHistoryAnswers[item];
                                              return (
                                                  <div key={i} className="flex items-center gap-1 bg-white border border-gray-200 rounded-full pl-3 pr-1 py-1">
                                                    <span className="text-sm text-gray-700 mr-1">{item}</span>

                                                    <button
                                                        onClick={() => setNegativeHistoryAnswer(item, 'yes')}
                                                        title="Symptom is present in this patient"
                                                        className={`text-xs px-2 py-1 rounded-full font-semibold ${answer === 'yes' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-red-50'}`}
                                                    >Present</button>
                                                    <button
                                                        onClick={() => setNegativeHistoryAnswer(item, 'no')}
                                                        title="Patient denies / ruled out"
                                                        className={`text-xs px-2 py-1 rounded-full font-semibold ${answer === 'no' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-green-50'}`}
                                                    >Ruled Out</button>

                                                  </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                    )}

                                    {examSuggestions?.investigations?.length > 0 && (
                                        <div>
                                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            Suggested Investigations
                                          </h4>
                                          <div className="flex flex-wrap gap-2">
                                            {examSuggestions.investigations.map((item, i) => {
                                              const isChecked = selectedInvestigations.includes(item);
                                              return (
                                                  <button
                                                      key={i}
                                                      onClick={() => toggleInvestigation(item)}
                                                      className={`px-3 py-1.5 rounded-full text-sm border ${
                                                          isChecked
                                                              ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                                                              : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-300'
                                                      }`}
                                                  >
                                                    {isChecked ? '✓ ' : ''}{item}
                                                  </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                    )}
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Add Test Manually
                                      </h4>
                                      <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={manualInvestigation}
                                            onChange={(e) => setManualInvestigation(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addManualInvestigation(); } }}
                                            placeholder="e.g., Widal Test, Stool Routine..."
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        />
                                        <button
                                            onClick={addManualInvestigation}
                                            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 flex items-center gap-1"
                                        >
                                          <Plus size={16}/> Add
                                        </button>
                                      </div>

                                      {selectedInvestigations.length > 0 && (
                                          <>
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                              Tests to Send ({selectedInvestigations.length})
                                            </h4>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                              {selectedInvestigations.map((item, i) => (
                                                  <span key={i} className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 border border-indigo-300 px-3 py-1.5 rounded-full text-sm">
                                                    {item}
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/70">{getTestCategory(item)}</span>
                                                    <button onClick={() => removeInvestigation(item)} className="text-indigo-500 hover:text-indigo-800 ml-1">
                                                      &times;
                                                    </button>
                                                  </span>
                                              ))}
                                            </div>
                                          </>
                                      )}
                                      <button
                                          onClick={() => {
                                            // Jo nava tests add karya hoy athva hju send na karyu hoy, to sendToLab run thase
                                            const hasNewTests = selectedInvestigations.some(test => !activePatient?.investigationsOrdered?.includes(test));
                                            if (activePatient?.labStatus !== 'Pending' || hasNewTests || selectedInvestigations.length > (activePatient?.investigationsOrdered?.length || 0)) {
                                              sendToLab();
                                            }
                                          }}
                                          disabled={selectedInvestigations.length === 0}
                                          className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 text-white transition-colors ${
                                              // CONDITION: Jo pending hoy ANE koi nava test extra select na karya hoy, to j BLACK. Baki BLUE!
                                              (activePatient?.labStatus === 'Pending' && selectedInvestigations.length <= (activePatient?.investigationsOrdered?.length || 0))
                                                  ? 'bg-gray-900 hover:bg-black'
                                                  : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                          }`}
                                      >
                                        <FlaskConical size={16} />
                                        {(activePatient?.labStatus === 'Pending' && selectedInvestigations.length <= (activePatient?.investigationsOrdered?.length || 0))
                                            ? 'Sent to Lab (Pending Report)'
                                            : 'Send to Lab'}
                                      </button>
                                    </div>

                                    {examSuggestions?.generalExamination?.length > 0 && (
                                        <div>
                                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">General Examination</h4>
                                          <div className="grid grid-cols-2 gap-3">
                                            {examSuggestions.generalExamination.map((param, i) => (
                                                <div key={i}>
                                                  <label className="block text-xs text-gray-500 mb-1">{param.name}</label>
                                                  <input
                                                      type="text"
                                                      value={examValues[param.name] || ''}
                                                      onChange={(e) => setExamValue(param.name, e.target.value)}
                                                      placeholder={`Normal: ${param.normalRange || 'Normal'}`}
                                                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                  />
                                                </div>
                                            ))}
                                          </div>
                                        </div>
                                    )}

                                    {examSuggestions?.systemicExamination?.length > 0 && (
                                        <div>
                                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Systemic Examination</h4>
                                          <div className="grid grid-cols-2 gap-3">
                                            {examSuggestions.systemicExamination.map((param, i) => (
                                                <div key={i}>
                                                  <label className="block text-xs text-gray-500 mb-1">{param.name}</label>
                                                  <input
                                                      type="text"
                                                      value={examValues[param.name] || ''}
                                                      onChange={(e) => setExamValue(param.name, e.target.value)}
                                                      placeholder={`Normal: ${param.normalRange}`}
                                                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                  />
                                                </div>
                                            ))}
                                          </div>
                                        </div>
                                    )}
                                  </div>

                                  <div className="p-4 bg-white border-t flex justify-between">
                                    <button
                                        onClick={() => setConsultStep('history')}
                                        className="bg-white border text-gray-600 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50"
                                    >
                                      ← Back
                                    </button>
                                    <button
                                        onClick={() => setConsultStep('findings')}
                                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm"
                                    >
                                      Next: Findings & Summary <ArrowRight size={16}/>
                                    </button>
                                  </div>
                                </div>
                            )}

                            {/* --- STEP 3: Findings & Summary --- */}
                            {consultStep === 'findings' && (
                                <div className="flex-1 flex flex-col overflow-hidden">
                                  <div className="p-4 border-b bg-gray-50">
                                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                      <FileText className="text-indigo-600" size={18}/> Findings & Summary
                                    </h3>
                                    <p className="text-xs text-gray-500">Review everything documented before running diagnosis.</p>
                                  </div>

                                  <div className="flex-1 overflow-y-auto p-5 space-y-5">

                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Symptoms</h4>
                                      {selectedSymptoms.length > 0 ? (
                                          <div className="flex flex-wrap gap-2">
                                            {selectedSymptoms.map(sym => {
                                              const d = symptomDurations[sym.id];
                                              return (
                                                  <span key={sym.id} className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-xs">
                              {sym.name}{d?.num ? ` (${d.num} ${d.unit})` : ''}
                            </span>
                                              );
                                            })}

                                          </div>
                                      ) : <p className="text-sm text-gray-400 italic">None selected</p>}
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Manual History/Compalint</h4>
                                      <p className="text-sm text-gray-800">{manualHistory || 'Not documented'}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Negative History</h4>
                                      {selectedNegativeHistory.length > 0 ? (
                                          <p className="text-sm text-gray-800">{selectedNegativeHistory.join(', ')}</p>
                                      ) : <p className="text-sm text-gray-400 italic">None confirmed</p>}
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Investigations Ordered</h4>
                                      {selectedInvestigations.length > 0 ? (
                                          <p className="text-sm text-gray-800">{selectedInvestigations.join(', ')}</p>
                                      ) : <p className="text-sm text-gray-400 italic">None selected</p>}
                                    </div>

                                    {activePatient?.labResults && (
                                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                          <h4 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1">Lab Results</h4>
                                          <p className="text-sm text-gray-800 whitespace-pre-wrap">{activePatient.labResults}</p>
                                          {activePatient.labImages && activePatient.labImages.length > 0 && (
                                              <div className="mt-3">
                                                <h5 className="text-xs font-bold text-yellow-700 uppercase mb-2">Radiology Images</h5>
                                                <div className="flex flex-wrap gap-2">
                                                  {activePatient.labImages.map(img => (
                                                      <a key={img.id} href={img.dataUrl} target="_blank" rel="noreferrer">
                                                        <img src={img.dataUrl} alt={img.name} className="w-24 h-24 rounded-lg object-cover border hover:opacity-80 transition-opacity" />
                                                      </a>
                                                  ))}
                                                </div>
                                              </div>
                                          )}
                                        </div>
                                    )}

                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Examination Findings</h4>

                                      {examSuggestions ? (
                                          <div className="grid grid-cols-2 gap-2">

                                            {examSuggestions.generalExamination?.map((param, i) => {
                                              const displayValue = examValues[param.name] || `Normal: ${param.normalRange || 'Normal'}`;
                                              return (
                                                  <p key={`gen-${i}`} className="text-sm text-gray-800">
                                                    <span className="text-gray-500">{param.name}:</span> {displayValue}
                                                  </p>
                                              );
                                            })}

                                            {examSuggestions.systemicExamination?.map((param, i) => {
                                              const displayValue = examValues[param.name] || `Normal: ${param.normalRange || 'Normal'}`;
                                              return (
                                                  <p key={`sys-${i}`} className="text-sm text-gray-800">
                                                    <span className="text-gray-500">{param.name}:</span> {displayValue}
                                                  </p>
                                              );
                                            })}
                                          </div>
                                      ) : (
                                          <p className="text-sm text-gray-400 italic">Not documented</p>
                                      )}

                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Occupation</h4>
                                      <p className="text-sm text-gray-800">{activePatient?.occupation} </p>
                                    </div>

                                  </div>

                                  <div className="p-4 bg-white border-t flex justify-between">
                                    <button
                                        onClick={() => setConsultStep('exams')}
                                        className="bg-white border text-gray-600 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50"
                                    >
                                      ← Back
                                    </button>
                                    <button
                                        onClick={() => setConsultStep('diagnosis')}
                                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm"
                                    >
                                      Next: Provisional Diagnosis <ArrowRight size={16}/>
                                    </button>
                                  </div>
                                </div>
                            )}

                            {/* --- STEP 4: Provisional Diagnosis --- */}

                            {consultStep === 'diagnosis' && (
                                <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-slate-50">
                                  <div className="mb-6 flex justify-between items-start">
                                    <div>
                                      <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                        <Stethoscope className="text-purple-600"/> Provisional Diagnosis
                                      </h3>
                                      <p className="text-sm text-gray-600 mt-1">Review AI suggestions based on clinical findings.</p>
                                    </div>

                                    <button
                                        onClick={runAIEngine}
                                        disabled={aiLoading}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:shadow-md transition-all disabled:opacity-70 flex-shrink-0"
                                    >
                                      {aiLoading ? (<><Activity size={16} className="animate-spin"/> Analyzing...</>) : (<><Sparkles size={16}/> Run AI Assistant</>)}
                                    </button>
                                  </div>

                                  {aiLoading ? (

                                      <div className="flex-1 flex flex-col items-center justify-center text-indigo-600 space-y-4">
                                        <Activity size={40} className="animate-spin"/>
                                        <p className="font-medium animate-pulse">Consulting medical literature & analyzing...</p>
                                      </div>
                                  ) : aiError ? (
                                      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
                                        <AlertTriangle className="shrink-0 mt-0.5" size={18}/>
                                        <p className="text-sm">{aiError}</p>
                                      </div>
                                  ) : aiResult ? (
                                      <div className="space-y-6">

                                        <div className="bg-white p-4 rounded-xl border shadow-sm">
                                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                            Add / Type Diagnosis Manually
                                          </label>
                                          <input
                                              type="text"
                                              value={manualDiagnosis}
                                              onChange={(e) => setManualDiagnosis(e.target.value)}
                                              placeholder="Type a custom diagnosis not in the AI list..."
                                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                          />
                                        </div>

                                        <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                                          <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-4 border-b border-indigo-50 pb-2">Possible Conditions (Select to accept)</h4>
                                          <div className="space-y-2">
                                            {aiResult.ddx.map((diag, idx) => (
                                                <label key={idx} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${selectedDdx.includes(diag) ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                                                  <div className="mt-0.5">
                                                    <input type="checkbox" checked={selectedDdx.includes(diag)} onChange={() => toggleDdxSelection(diag)} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"/>
                                                  </div>
                                                  <span className={`text-sm font-medium ${selectedDdx.includes(diag) ? 'text-indigo-900' : 'text-gray-700'}`}>{diag}</span>
                                                </label>
                                            ))}
                                          </div>
                                          {aiResult.reasoning && (
                                              <div className="mt-4 pt-3 border-t border-indigo-50 bg-indigo-50/50 rounded-lg p-3">
                                                <h5 className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-1">AI Reasoning (for reference only — not printed)</h5>
                                                <p className="text-xs text-gray-600 leading-relaxed">{aiResult.reasoning}</p>
                                              </div>
                                          )}
                                        </div>

                                        <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
                                          <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3 border-b border-blue-50 pb-2">Suggested Investigations</h4>

                                          <div className="flex flex-wrap gap-2">
                                            {aiResult.labs.map((lab, idx) => {
                                              const isChecked = selectedAiLabs.includes(lab);
                                              return (
                                                  <button
                                                      key={idx}
                                                      onClick={() => toggleAiLab(lab)}
                                                      className={`px-3 py-1.5 rounded-full text-sm border ${
                                                          isChecked
                                                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                                                              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                                                      }`}
                                                  >
                                                    {isChecked ? '✓ ' : ''}{lab}
                                                  </button>
                                              );
                                            })}
                                          </div>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-4">
                                          <button
                                              onClick={sendDiagnosisLabsToLab}
                                              disabled={selectedAiLabs.length === 0}
                                              className="bg-blue-100 text-blue-700 px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                          >
                                            🧪 Send to Lab {selectedAiLabs.length > 0 ? `(${selectedAiLabs.length})` : ''}
                                          </button>
                                          <button onClick={acceptDiagnosis} disabled={selectedDdx.length === 0 && !manualDiagnosis.trim()} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm">
                                            Accept & Continue to Plan <ArrowRight size={16}/>
                                          </button>
                                        </div>

                                      </div>
                                  ) : (
                                      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-3">
                                        <Sparkles size={32} className="opacity-50"/>
                                        <p className="text-sm">Click "Run AI Assistant" above to generate a differential diagnosis.</p>
                                      </div>
                                  )}

                                  <div className="pt-6 flex justify-start">
                                    <button onClick={() => setConsultStep('findings')} className="bg-white border text-gray-600 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50">
                                      ← Back
                                    </button>
                                  </div>
                                </div>
                            )}

                            {/* --- STEP 5: Treatment Plan & Rx --- */}

                            {consultStep === 'plan' && (
                                <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                                  <div className="p-4 border-b bg-white flex justify-between items-center shadow-sm z-10">
                                    <div>
                                      <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">Treatment Plan</h3>
                                      <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1 items-center">
                                        Diagnosis:
                                        {acceptedDiagnosis.map((d, i) => (
                                            <span key={i} className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-medium">{d}</span>
                                        ))}
                                      </div>
                                    </div>
                                    <button onClick={generateAIPrescription} disabled={aiRxLoading || acceptedDiagnosis.length === 0} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-purple-700 transition-all shadow-sm disabled:opacity-50">
                                      {aiRxLoading ? <Activity size={16} className="animate-spin"/> : <Sparkles size={16}/>}
                                      Auto-Generate Rx
                                    </button>
                                  </div>



                                  {/* Sub-tabs for Rx / Procedures / Non-Pharma / Follow-up */}
                                  <div className="flex border-b bg-gray-50 px-4 gap-1 overflow-x-auto">
                                    {[
                                      { id: 'rx', label: 'Prescription (Rx)', count: prescriptions.length },
                                      { id: 'procedures', label: 'Procedures', count: nonPharmManagement.filter(i => i.type === 'Procedure').length },
                                      { id: 'nonpharm', label: 'Non-Pharma Advice', count: nonPharmManagement.filter(i => i.type === 'Advice').length },
                                      { id: 'followup', label: 'Follow-up', count: followUpAdvice.trim() ? 1 : 0 },
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setPlanSubTab(tab.id)}
                                            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                                                planSubTab === tab.id
                                                    ? 'border-indigo-600 text-indigo-700'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                          {tab.label}
                                          {tab.count > 0 && (
                                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                                  planSubTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'
                                              }`}>
                                                {tab.count}
                                              </span>
                                          )}
                                        </button>
                                    ))}
                                  </div>

                                  <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                    {aiRxError && (
                                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex gap-2 items-center">
                                          <AlertTriangle size={16}/> {aiRxError}
                                        </div>
                                    )}

                                    {planSubTab === 'rx' && (
                                        <>
                                          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                            {prescriptions.length === 0 ? (
                                                <div className="p-8 text-center text-gray-400 text-sm">
                                                  No medications added yet. <br/>Use AI generation or add manually below.
                                                </div>
                                            ) : (
                                                <ul className="divide-y">
                                                  {prescriptions.map((med, idx) => (
                                                      <li key={med.id} className="p-4 flex justify-between items-start hover:bg-gray-50">
                                                        <div className="flex items-start gap-3">
                                                          <div className="mt-1 bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                                                          <div>
                                                            <h5 className="font-bold text-gray-900">{med.name}</h5>
                                                            <div className="flex gap-4 mt-1 text-sm text-gray-600">
                                                              <span className="font-medium bg-gray-100 px-2 rounded">{med.dosage}</span>
                                                              <span>for <span className="font-medium text-gray-800">{med.duration}</span></span>
                                                            </div>
                                                            {med.note && <p className="text-xs text-gray-500 mt-1.5 italic">{med.note}</p>}
                                                          </div>
                                                        </div>
                                                        <button onClick={() => removeMedicine(med.id)} className="text-red-400 hover:text-red-600 p-1">
                                                          <Trash2 size={16}/>
                                                        </button>
                                                      </li>
                                                  ))}
                                                </ul>
                                            )}
                                          </div>

                                          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-4 shadow-sm">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Add Medication Manually</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                              <div className="sm:col-span-5">
                                                <input type="text" placeholder="Medicine Name (e.g., Tab. Azithromycin 500mg)" value={medName} onChange={e => setMedName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
                                              </div>
                                              <div className="sm:col-span-3">
                                                <input type="text" placeholder="Dosage (e.g., 1-0-1)" value={medDosage} onChange={e => setMedDosage(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
                                              </div>
                                              <div className="sm:col-span-2">
                                                <input type="text" placeholder="Days" value={medDuration} onChange={e => setMedDuration(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
                                              </div>
                                              <div className="sm:col-span-2">
                                                <button onClick={addManualMedicine} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors h-full flex justify-center items-center">
                                                  <Plus size={16}/> Add
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                    )}

                                    {planSubTab === 'procedures' && (
                                        <div className="bg-white rounded-xl border shadow-sm p-4">
                                          <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Procedural Management</h4>
                                          {nonPharmManagement.filter(item => item.type === 'Procedure').length === 0 ? (
                                              <p className="text-sm text-gray-400 italic mb-2">None added.</p>
                                          ) : (
                                              <ul className="divide-y border rounded-lg mb-2">
                                                {nonPharmManagement.map((item, idx) => item.type === 'Procedure' && (
                                                    <li key={idx} className="p-3 flex items-start justify-between gap-2">
                                                      <span className="text-sm text-gray-800">{item.text}</span>
                                                      <button onClick={() => removeNonPharmItem(idx)} className="text-red-400 hover:text-red-600 p-1 shrink-0">
                                                        <Trash2 size={14}/>
                                                      </button>
                                                    </li>
                                                ))}
                                              </ul>
                                          )}
                                          <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="e.g., Incision & drainage, suturing, splinting, referral"
                                                value={manualProcedureInput}
                                                onChange={(e) => setManualProcedureInput(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addManualProcedure(); } }}
                                                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                                            />
                                            <button onClick={addManualProcedure} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-1">
                                              <Plus size={16}/> Add
                                            </button>
                                          </div>
                                        </div>
                                    )}

                                    {planSubTab === 'nonpharm' && (
                                        <div className="bg-white rounded-xl border shadow-sm p-4">
                                          <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Non-Pharmacological Advice</h4>
                                          {nonPharmManagement.filter(item => item.type === 'Advice').length === 0 ? (
                                              <p className="text-sm text-gray-400 italic mb-2">None added.</p>
                                          ) : (
                                              <ul className="divide-y border rounded-lg mb-2">
                                                {nonPharmManagement.map((item, idx) => item.type === 'Advice' && (
                                                    <li key={idx} className="p-3 flex items-start justify-between gap-2">
                                                      <span className="text-sm text-gray-800">{item.text}</span>
                                                      <button onClick={() => removeNonPharmItem(idx)} className="text-red-400 hover:text-red-600 p-1 shrink-0">
                                                        <Trash2 size={14}/>
                                                      </button>
                                                    </li>
                                                ))}
                                              </ul>
                                          )}
                                          <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="e.g., Diet advice, rest, plenty of fluids, wound care"
                                                value={manualAdviceInput}
                                                onChange={(e) => setManualAdviceInput(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addManualAdvice(); } }}
                                                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                                            />
                                            <button onClick={addManualAdvice} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 flex items-center gap-1">
                                              <Plus size={16}/> Add
                                            </button>
                                          </div>
                                        </div>
                                    )}

                                    {planSubTab === 'followup' && (
                                        <div className="bg-white rounded-xl border shadow-sm p-4">
                                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                            Advice & Follow-up Instructions
                                          </label>
                                          <textarea
                                              value={followUpAdvice}
                                              onChange={(e) => setFollowUpAdvice(e.target.value)}
                                              rows={4}
                                              placeholder="e.g., Review after 5 days, drink plenty of fluids, return if fever persists >3 days"
                                              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                          />
                                        </div>
                                    )}
                                  </div>


                                  {(aiRouteOfCare === 'IPD' || requiresIVAdmission(prescriptions, nonPharmManagement.filter(i => i.type === 'Procedure')) ) && (
                                      <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-lg p-1 flex items-start gap-3">
                                        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18}/>
                                        <div className="flex-1">
                                          <p className="text-sm font-semibold text-red-800">IV therapy / inpatient care recommended</p>
                                          <p className="text-xs text-red-600 mt-0.5">
                                            {aiRouteOfCare === 'IPD' ? 'AI assessment suggests IPD admission. ' : 'IV medication detected in the prescription. '}
                                            This patient will be routed to IPD instead of Pharmacy unless overridden below.
                                          </p>
                                          <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => setRouteOverride('IPD')}
                                                className={`text-xs px-3 py-1 rounded-full border font-medium ${routeOverride !== 'OPD' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-red-700 border-red-300'}`}
                                            >
                                              Keep as IPD
                                            </button>
                                            <button
                                                onClick={() => setRouteOverride('OPD')}
                                                className={`text-xs px-3 py-1 rounded-full border font-medium ${routeOverride === 'OPD' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300'}`}
                                            >
                                              Override → Send to Pharmacy (OPD)
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                  )}



                                  <div className="p-4 bg-white border-t flex justify-between gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                    <button onClick={() => setConsultStep('diagnosis')} className="bg-white border text-gray-600 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50">
                                      ← Back

                                    </button>
                                    <div className="flex items-center gap-4">
                                      <button onClick={() => printPrescription(activePatient)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                                        Print Case Paper

                                      </button>
                                      <button onClick={finishConsultation} className="bg-green-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm">
                                        <CheckCircle2 size={18}/> Send to Pharmacy/IPD
                                      </button>
                                    </div>
                                  </div>
                                </div>
                            )}

                          </div>
                        </div>
                    ) : (
                        <div
                            className="flex-1 flex items-center justify-center bg-white rounded-xl border border-dashed border-gray-300">
                          <div className="text-center text-gray-500">
                            <User size={48} className="mx-auto text-gray-300 mb-4"/>
                            <h3 className="text-lg font-medium text-gray-800">No Patient Selected</h3>
                            <p className="text-sm mt-1">Select a patient from the waiting queue above to begin
                              consultation.</p>
                          </div>
                        </div>
                    )}
                  </div>
              )}

              {activeTab === 'ipd' && (
                  <div className="max-w-4xl mx-auto space-y-4">
                    <h2 className="text-xl font-bold text-gray-700">IPD Ward</h2>
                    <div className="bg-white p-3 rounded-xl border shadow-sm flex items-center gap-2">
                      <Search size={16} className="text-gray-400 shrink-0"/>
                      <input
                          type="text"
                          value={ipdSearch}
                          onChange={(e) => setIpdSearch(e.target.value)}
                          placeholder="Search by UHID or patient name..."
                          className="w-full outline-none text-sm"
                      />
                    </div>
                    {patients.filter(p => p.status === 'IPD' && matchesSearch(p, ipdSearch)).length === 0 ? (
                        <div className="bg-white p-8 rounded-xl border text-center text-gray-400">
                          No matching admitted patients.
                        </div>
                    ) : (
                        patients.filter(p => p.status === 'IPD' && matchesSearch(p, ipdSearch)).map(p => (


                            <div key={p.id} className="bg-white p-4 rounded-xl border shadow-sm">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold">{p.name} <span className="text-sm text-gray-500">({p.age}, {p.gender})</span></h3>
                                  <p className="text-xs text-gray-500">{p.uhid}</p>
                                  <p className="text-sm text-indigo-700 font-medium mt-1">{(p.diagnoses || []).join(', ')}</p>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">ADMITTED</span>
                              </div>

                              <div className="mt-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Day-wise Orders</h4>

                                {/* Day tabs */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {(p.dailyOrders || []).map(day => (
                                      <button
                                          key={day.id}
                                          onClick={() => setIpdActiveDayMap(prev => ({ ...prev, [p.id]: day.id }))}
                                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                                              (ipdActiveDayMap[p.id] || (p.dailyOrders || [])[(p.dailyOrders || []).length - 1]?.id) === day.id
                                                  ? 'bg-red-600 text-white border-red-600'
                                                  : 'bg-white text-gray-600 border-gray-300 hover:border-red-300'
                                          }`}
                                      >
                                        {day.label}{day.date ? ` (${day.date})` : ''}
                                      </button>
                                  ))}
                                  <button
                                      onClick={() => addIpdDay(p)}
                                      className="px-3 py-1.5 rounded-full text-xs font-semibold border border-dashed border-gray-400 text-gray-600 hover:border-red-400 hover:text-red-600 flex items-center gap-1"
                                  >
                                    <Plus size={12}/> New Day
                                  </button>
                                </div>

                                {(p.dailyOrders || []).length === 0 ? (
                                    <p className="text-sm text-gray-400 italic mb-3">No days added yet — click "New Day" to start ordering.</p>
                                ) : (() => {
                                  const activeDay = getActiveIpdDay(p);
                                  if (!activeDay) return null;

                                  return (
                                      <div className="border rounded-lg p-3 bg-gray-50 space-y-4">

                                        {/* Vitals for this day — Multiple readings with time (uncontrolled, typing-safe) */}
                                        <div>
                                          <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Vitals — {activeDay.label}</h5>
                                          {(activeDay.vitalsLog || []).length === 0 ? (
                                              <p className="text-sm text-gray-400 italic mb-2">No readings recorded yet.</p>
                                          ) : (
                                              <div className="space-y-1.5 mb-2">
                                                {activeDay.vitalsLog.map(v => (
                                                    <div key={v.id} className="grid grid-cols-5 gap-2 bg-white border rounded-lg p-2 items-center">
                                                      <div><p className="text-[10px] text-gray-400">Time</p><p className="text-sm font-bold text-red-600">{v.time}</p></div>
                                                      <div><p className="text-[10px] text-gray-400">BP</p><p className="text-sm font-semibold">{v.bp}</p></div>
                                                      <div><p className="text-[10px] text-gray-400">Pulse</p><p className="text-sm font-semibold">{v.pulse}</p></div>
                                                      <div><p className="text-[10px] text-gray-400">Temp</p><p className="text-sm font-semibold">{v.temp}</p></div>
                                                      <div><p className="text-[10px] text-gray-400">SpO2</p><p className="text-sm font-semibold">{v.spo2}</p></div>
                                                    </div>
                                                ))}
                                              </div>
                                          )}
                                          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                                            <input type="text" placeholder="Time (08:00 AM)" defaultValue="" ref={(el) => setIpdVitalRef(p.id, 'time', el)} className="border rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-red-400 outline-none" />
                                            <input type="text" placeholder="BP (120/80)" defaultValue="" ref={(el) => setIpdVitalRef(p.id, 'bp', el)} className="border rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-red-400 outline-none" />
                                            <input type="text" placeholder="Pulse (78)" defaultValue="" ref={(el) => setIpdVitalRef(p.id, 'pulse', el)} className="border rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-red-400 outline-none" />
                                            <input type="text" placeholder="Temp (98.6)" defaultValue="" ref={(el) => setIpdVitalRef(p.id, 'temp', el)} className="border rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-red-400 outline-none" />
                                            <input type="text" placeholder="SpO2 (98)" defaultValue="" ref={(el) => setIpdVitalRef(p.id, 'spo2', el)} className="border rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-red-400 outline-none" />
                                            <button onClick={() => saveIpdDayVitals(p)} className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700">+ Add Reading</button>
                                          </div>
                                        </div>
                                        {/* Medications for this day */}

                                        <div>
                                          <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Medications — {activeDay.label}</h5>
                                          {activeDay.meds.length === 0 ? (
                                              <p className="text-sm text-gray-400 italic mb-2">None added for this day.</p>
                                          ) : (
                                              <ul className="divide-y border rounded-lg bg-white mb-2">
                                                {activeDay.meds.map(m => (
                                                    <li key={m.id} className={`flex items-center justify-between px-3 py-2 ${m.given ? 'bg-green-50' : ''}`}>
                                                      <label className="flex items-center gap-2 flex-1 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!m.given}
                                                            onChange={() => toggleIpdMedGiven(p, activeDay.id, m.id)}
                                                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500 shrink-0"
                                                        />
                                                        <span className={`text-sm ${m.given ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                                          <span className="font-medium">{m.name}</span> — {m.dosage}, {m.duration}
                                                        </span>
                                                        {m.given ? (
                                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">Given</span>
                                                        ) : (
                                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 shrink-0">Pending</span>
                                                        )}
                                                      </label>
                                                      <button
                                                          onClick={() => removeIpdMedication(p, activeDay.id, m.id)}
                                                          className="text-red-400 hover:text-red-600 p-1 shrink-0"
                                                      >
                                                        <Trash2 size={14}/>
                                                      </button>
                                                    </li>
                                                ))}
                                              </ul>
                                          )}

                                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                                            <div className="sm:col-span-5">
                                              <input
                                                  type="text"
                                                  placeholder="e.g., Inj. Ceftriaxone 1g IV"
                                                  value={ipdMedInputs[p.id]?.name || ''}
                                                  onChange={(e) => handleIpdMedInputChange(p.id, 'name', e.target.value)}
                                                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 outline-none"
                                              />
                                            </div>
                                            <div className="sm:col-span-3">
                                              <input
                                                  type="text"
                                                  placeholder="Dosage (e.g., BD)"
                                                  value={ipdMedInputs[p.id]?.dosage ?? '1-0-1'}
                                                  onChange={(e) => handleIpdMedInputChange(p.id, 'dosage', e.target.value)}
                                                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 outline-none"
                                              />
                                            </div>
                                            <div className="sm:col-span-2">
                                              <input
                                                  type="text"
                                                  placeholder="Duration"
                                                  value={ipdMedInputs[p.id]?.duration ?? '1 Day'}
                                                  onChange={(e) => handleIpdMedInputChange(p.id, 'duration', e.target.value)}
                                                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 outline-none"
                                              />
                                            </div>
                                            <div className="sm:col-span-2">
                                              <button
                                                  onClick={() => addIpdMedication(p)}
                                                  className="w-full bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors h-full flex justify-center items-center gap-1"
                                              >
                                                <Plus size={16}/> Add
                                              </button>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Advice for this day */}
                                        <div>
                                          <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Advice / Nursing Instructions — {activeDay.label}</h5>
                                          {activeDay.advice.length === 0 ? (
                                              <p className="text-sm text-gray-400 italic mb-2">None added for this day.</p>
                                          ) : (
                                              <ul className="divide-y border rounded-lg bg-white mb-2">
                                                {activeDay.advice.map(a => (
                                                    <li key={a.id} className="flex items-center justify-between px-3 py-2">
                                                      <span className="text-sm text-gray-800">{a.text}</span>
                                                      <button
                                                          onClick={() => removeIpdAdvice(p, activeDay.id, a.id)}
                                                          className="text-red-400 hover:text-red-600 p-1"
                                                      >
                                                        <Trash2 size={14}/>
                                                      </button>
                                                    </li>
                                                ))}
                                              </ul>
                                          )}
                                          <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="e.g., Monitor vitals 4-hourly, NPO after midnight, elevate limb"
                                                value={ipdAdviceInputs[p.id] || ''}
                                                onChange={(e) => setIpdAdviceInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIpdAdvice(p); } }}
                                                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 outline-none"
                                            />
                                            <button
                                                onClick={() => addIpdAdvice(p)}
                                                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 flex items-center gap-1"
                                            >
                                              <Plus size={16}/> Add
                                            </button>
                                          </div>
                                        </div>

                                        {/* Procedures for this day */}
                                        <div>
                                          <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                            Procedures — {activeDay.label}
                                            {(activeDay.procedures || []).length > 0 && (
                                                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold align-middle">
                                                  {(activeDay.procedures || []).length}
                                                </span>
                                            )}
                                          </h5>
                                          {(activeDay.procedures || []).length === 0 ? (
                                              <p className="text-sm text-gray-400 italic mb-2">None added for this day.</p>
                                          ) : (
                                              <ul className="divide-y border rounded-lg bg-white mb-2">
                                                {activeDay.procedures.map(pr => (
                                                    <li key={pr.id} className="flex items-center justify-between px-3 py-2">
                                                      <span className="text-sm text-gray-800">
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 mr-2">Procedure</span>
                                                        {pr.text}
                                                      </span>
                                                      <button
                                                          onClick={() => removeIpdProcedure(p, activeDay.id, pr.id)}
                                                          className="text-red-400 hover:text-red-600 p-1"
                                                      >
                                                        <Trash2 size={14}/>
                                                      </button>
                                                    </li>
                                                ))}
                                              </ul>
                                          )}
                                          <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="e.g., Incision & drainage, wound dressing, catheterization"
                                                value={ipdProcedureInputs[p.id] || ''}
                                                onChange={(e) => setIpdProcedureInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIpdProcedure(p); } }}
                                                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                                            />
                                            <button
                                                onClick={() => addIpdProcedure(p)}
                                                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-1"
                                            >
                                              <Plus size={16}/> Add
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                  );
                                })()}

                              </div>

                              <div className="mt-4 border-t pt-4">
                                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                  Investigations / Lab Orders
                                </h5>
                                {(p.investigationsOrdered || []).length === 0 ? (
                                    <p className="text-sm text-gray-400 italic mb-2">No investigations ordered yet.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {(p.investigationsOrdered || []).map((inv, i) => {
                                        const cat = getTestCategory(inv);
                                        const isDone = (p.completedTests || []).includes(inv);
                                        return (
                                            <span key={i} className={`inline-flex items-center gap-1 border px-3 py-1.5 rounded-full text-sm ${
                                                isDone ? 'bg-green-100 text-green-800 border-green-300' : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                            }`}>
                {inv}
                                              <span className="text-[9px] font-bold">{isDone ? '✓ Done' : '⏳ Pending'}</span>
                <button onClick={() => removeIpdInvestigation(p, inv)} className="ml-1 opacity-60 hover:opacity-100">&times;</button>
              </span>
                                        );
                                      })}
                                    </div>
                                )}

                                {/* NEW: Lab Results display for IPD */}
                                {p.labResults && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
                                      <h6 className="text-xs font-bold text-yellow-700 uppercase mb-1">Lab Results</h6>
                                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{p.labResults}</p>
                                      {p.labImages && p.labImages.length > 0 && (
                                          <div className="flex flex-wrap gap-2 mt-2">
                                            {p.labImages.map(img => (
                                                <a key={img.id} href={img.dataUrl} target="_blank" rel="noreferrer">
                                                  <img src={img.dataUrl} alt={img.name} className="w-20 h-20 rounded-lg object-cover border" />
                                                </a>
                                            ))}
                                          </div>
                                      )}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                  <input
                                      type="text"
                                      placeholder="e.g., CBC, RFT, X-Ray Chest..."
                                      value={ipdInvestigationInputs[p.id] || ''}
                                      onChange={(e) => setIpdInvestigationInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIpdInvestigation(p); } }}
                                      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                  />
                                  <button
                                      onClick={() => addIpdInvestigation(p)}
                                      disabled={!(ipdInvestigationInputs[p.id] || '').trim()}
                                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 text-white transition-colors ${
                                          p.labStatus === 'Pending' && !(ipdInvestigationInputs[p.id] || '').trim()
                                              ? 'bg-gray-900 hover:bg-black'
                                              : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                      }`}
                                  >
                                    <Plus size={16}/> {p.labStatus === 'Pending' ? 'Sent to Lab (Pending)' : 'Send to Lab'}
                                  </button>
                                </div>
                              </div>


                              <div className="mt-3 flex justify-end gap-2">
                                <button
                                    onClick={() => { printIpdCasePaper(p); setIpdPrinted(prev => ({ ...prev, [p.id]: true })); }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                                >
                                  🖨️ Print Case Paper
                                </button>

                                <button
                                    disabled={!ipdPrinted[p.id]}
                                    onClick={() => openDischargeModal(p)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${ipdPrinted[p.id] ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'}`}
                                >
                                  Discharge → Send to Pharmacy
                                </button>
                              </div>
                            </div>
                        ))
                    )}
                  </div>
              )}
              {/* --- DISCHARGE MODAL --- */}
              {showDischargeModal && dischargePatient && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]">
                      <div className="p-5 border-b flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Discharge — {dischargePatient.name}</h3>
                          <p className="text-xs text-gray-500">{dischargePatient.uhid} • Step {dischargeStep} of 3</p>
                        </div>
                        <button onClick={() => setShowDischargeModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-5 space-y-4">

                        {dischargeStep === 1 && (
                            <>
                              <h4 className="text-sm font-bold text-gray-700 mb-2">Discharge Outcome</h4>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {['Cured / Recovered', 'Relieved / Improved', 'LAMA', 'DAMA', 'Referred', 'Absconded', 'Death / Expired'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setDischargeOutcome(opt)}
                                        className={`px-3 py-2.5 rounded-lg text-sm font-medium border text-left ${
                                            dischargeOutcome === opt
                                                ? 'bg-purple-600 text-white border-purple-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                                        }`}
                                    >
                                      {opt}
                                    </button>
                                ))}
                              </div>

                              {['LAMA', 'DAMA', 'Referred', 'Death / Expired'].includes(dischargeOutcome) && (
                                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4 space-y-3">
                                    <h5 className="text-xs font-bold text-amber-700 uppercase tracking-wider">Consent / Notification Details</h5>
                                    <div className="grid grid-cols-2 gap-3">
                                      <input type="text" placeholder="Consent Giver Name" value={consentGiverName} onChange={(e) => setConsentGiverName(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
                                      <input type="text" placeholder="Relation with Patient" value={consentRelation} onChange={(e) => setConsentRelation(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
                                      <input type="text" placeholder="Mobile Number" value={consentMobile} onChange={(e) => setConsentMobile(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
                                      <input type="text" placeholder="Reason / Remarks" value={consentReason} onChange={(e) => setConsentReason(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
                                    </div>
                                  </div>
                              )}
                            </>
                        )}

                        {dischargeStep === 2 && (
                            <>
                              {dischargeSummaryLoading ? (
                                  <div className="flex flex-col items-center justify-center text-purple-600 py-10 space-y-3">
                                    <Activity size={32} className="animate-spin"/>
                                    <p className="text-sm font-medium">Generating discharge summary...</p>
                                  </div>
                              ) : dischargeSummaryError ? (
                                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
                                    <AlertTriangle className="shrink-0 mt-0.5" size={18}/>
                                    <p className="text-sm">{dischargeSummaryError}</p>
                                  </div>
                              ) : (
                                  <>
                                    <div className="flex justify-between items-center mb-2">
                                      <h4 className="text-sm font-bold text-gray-700">AI-Generated Discharge Summary (editable)</h4>
                                      <button onClick={generateDischargeSummary} className="text-xs text-purple-600 font-semibold flex items-center gap-1 hover:text-purple-800">
                                        <Sparkles size={12}/> Regenerate
                                      </button>
                                    </div>
                                    <textarea
                                        value={dischargeSummary}
                                        onChange={(e) => setDischargeSummary(e.target.value)}
                                        rows={16}
                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                  </>
                              )}
                            </>
                        )}

                        {dischargeStep === 3 && (
                            <div className="space-y-4">
                              <div className="bg-gray-50 border rounded-lg p-4">
                                <p className="text-sm"><b>Outcome:</b> {dischargeOutcome}</p>
                                {['LAMA', 'DAMA', 'Referred', 'Death / Expired'].includes(dischargeOutcome) && (
                                    <p className="text-sm mt-1"><b>Consent:</b> {consentGiverName} ({consentRelation}), {consentMobile}</p>
                                )}
                                <p className="text-sm mt-1"><b>Summary:</b> Ready ({dischargeSummary.length} chars)</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                Confirming will move this patient to Pharmacy for final medicine dispensing.
                              </p>
                            </div>
                        )}
                      </div>

                      <div className="p-4 border-t flex justify-between items-center bg-gray-50 rounded-b-2xl">
                        <button
                            onClick={() => dischargeStep === 1 ? setShowDischargeModal(false) : setDischargeStep(dischargeStep - 1)}
                            className="bg-white border text-gray-600 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100"
                        >
                          {dischargeStep === 1 ? 'Cancel' : '← Back'}
                        </button>

                        {dischargeStep === 1 && (
                            <button
                                disabled={!dischargeOutcome || (['LAMA', 'DAMA', 'Referred', 'Death / Expired'].includes(dischargeOutcome) && (!consentGiverName.trim() || !consentMobile.trim()))}
                                onClick={() => { setDischargeStep(2); generateDischargeSummary(); }}
                                className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-700"
                            >
                              Next: Generate Summary →
                            </button>
                        )}

                        {dischargeStep === 2 && (
                            <button
                                disabled={!dischargeSummary.trim() || dischargeSummaryLoading}
                                onClick={() => setDischargeStep(3)}
                                className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-700"
                            >
                              Next: Confirm →
                            </button>
                        )}

                        {dischargeStep === 3 && (
                            <div className="flex gap-2">
                              <button
                                  onClick={() => printDischargeSummary({ ...dischargePatient, dischargeOutcome, dischargeSummary, dischargedAt: dischargePatient.dischargedAt || new Date().toISOString() })}
                                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700"
                              >
                                🖨️ Print Discharge Paper
                              </button>
                              <button
                                  onClick={confirmDischargeAndSendToPharmacy}
                                  className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-green-700 flex items-center gap-2"
                              >
                                <CheckCircle2 size={16}/> Confirm Discharge & Send to Pharmacy
                              </button>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
              )}

              {/* --- LAB TAB (Real) --- */}

              {/* --- LAB TAB (Real) --- */}

              {activeTab === 'lab' && (
                  <div className="max-w-3xl mx-auto space-y-4">
                    <h2 className="text-xl font-bold text-gray-700">Laboratory</h2>
                    <div className="bg-white p-3 rounded-xl border shadow-sm flex items-center gap-2">
                      <Search size={16} className="text-gray-400 shrink-0"/>
                      <input
                          type="text"
                          value={labSearch}
                          onChange={(e) => setLabSearch(e.target.value)}
                          placeholder="Search by UHID or patient name..."
                          className="w-full outline-none text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['All', 'Radiology', 'Pathology', 'Microbiology', 'Biochemistry', 'Other'].map(cat => (
                          <button
                              key={cat}
                              onClick={() => setLabCategoryFilter(cat)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                                  labCategoryFilter === cat
                                      ? 'bg-gray-800 text-white border-gray-800'
                                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                              }`}
                          >
                            {cat}
                          </button>
                      ))}
                    </div>
                    {patients.filter(p => p.labStatus === 'Pending' && matchesSearch(p, labSearch) && (labCategoryFilter === 'All' || (p.investigationsOrdered || []).some(inv => getTestCategory(inv) === labCategoryFilter))).length === 0 ? (
                        <div className="bg-white p-8 rounded-xl border text-center text-gray-400">
                          No matching patients waiting for lab results.
                        </div>
                    ) : (
                        <div className="space-y-4">
                          {patients.filter(p => p.labStatus === 'Pending' && matchesSearch(p, labSearch) && (labCategoryFilter === 'All' || (p.investigationsOrdered || []).some(inv => getTestCategory(inv) === labCategoryFilter))).map(p => (
                              <div key={p.id} className="bg-white p-4 rounded-xl border shadow-sm">
                                <h3 className="font-bold">{p.name} <span className="text-sm text-gray-500">({p.age}y, {p.gender})</span></h3>

                                <p className="text-sm text-gray-600 mb-2">Investigations ordered: {(p.investigationsOrdered || []).join(', ') || 'General'}</p>
                                {(() => {
                                  const invList = p.investigationsOrdered && p.investigationsOrdered.length > 0 ? p.investigationsOrdered : ['General Test'];

                                  const completedList = p.completedTests || [];
                                  const radiologyEntries = invList.map((inv, idx) => ({ inv, idx })).filter(({ inv }) => getTestCategory(inv) === 'Radiology' && !completedList.includes(inv));
                                  const diagLabEntries = invList.map((inv, idx) => ({ inv, idx })).filter(({ inv }) => getTestCategory(inv) !== 'Radiology' && !completedList.includes(inv));

                                  return (
                                      <div className="space-y-5 mb-3">
                                        {/* ===== RADIOLOGY SECTION ===== */}
                                        {radiologyEntries.length > 0 && (
                                            <div className="border-2 border-purple-200 rounded-lg p-3 bg-purple-50/40">
                                              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 px-2 py-1 rounded inline-block bg-purple-100 text-purple-700">
                                                Radiology
                                              </h3>
                                              <div className="space-y-2">
                                                {radiologyEntries.map(({ inv, idx }) => (
                                                    <div key={idx} className="border rounded-lg p-3 bg-white">
                                                      <h4 className="text-sm font-bold text-gray-700 mb-2">{inv}</h4>
                                                      {getTestParams(inv).map((param, pIdx) => (
                                                          <div key={pIdx} className="grid grid-cols-3 gap-2 items-center mb-2">
                                                            <span className="text-xs text-gray-600">{param.name}</span>
                                                            <input type="text" placeholder="Value" className="border rounded p-2 text-sm" id={`lab-val-${p.id}-${idx}-${pIdx}`} disabled={p.radiologyDone} />
                                                            <input type="text" defaultValue={param.ref} className="border rounded p-2 text-sm text-gray-600" id={`lab-ref-${p.id}-${idx}-${pIdx}`} disabled={p.radiologyDone} />
                                                          </div>
                                                      ))}
                                                    </div>
                                                ))}
                                              </div>

                                              <div className="mt-2 border-2 border-dashed border-purple-200 rounded-lg p-3 bg-white">
                                                <h5 className="text-xs font-bold text-purple-700 uppercase mb-2">Attach Radiology Images</h5>
                                                <div className="flex flex-wrap gap-3">
                                                  {(radiologyImages[p.id] || []).map(img => (
                                                      <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                                        <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                                                        <button onClick={() => removeRadiologyImage(p.id, img.id)}
                                                                className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
                                                      </div>
                                                  ))}
                                                  {!p.radiologyDone && (
                                                      <>
                                                        <label className="w-20 h-20 rounded-lg border-2 border-dashed border-purple-300 flex flex-col items-center justify-center text-purple-400 cursor-pointer hover:border-purple-500 hover:text-purple-600 bg-white">
                                                          <Plus size={18}/>
                                                          <span className="text-[10px] mt-1">Gallery</span>
                                                          <input type="file" accept="image/*" multiple onChange={(e) => handleRadiologyImageUpload(p.id, e)} className="hidden" />
                                                        </label>
                                                        <label className="w-20 h-20 rounded-lg border-2 border-dashed border-purple-300 flex flex-col items-center justify-center text-purple-400 cursor-pointer hover:border-purple-500 hover:text-purple-600 bg-white">
                                                          <Camera size={18}/>
                                                          <span className="text-[10px] mt-1">Camera</span>
                                                          <input type="file" accept="image/*" capture="environment" onChange={(e) => handleRadiologyImageUpload(p.id, e)} className="hidden" />
                                                        </label>
                                                      </>
                                                  )}
                                                </div>
                                              </div>

                                              <button
                                                  onClick={() => sendLabSection(p, 'radiology')}
                                                  disabled={p.radiologyDone}
                                                  className={`w-full mt-3 py-2 rounded-lg text-sm font-bold ${p.radiologyDone ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                                              >
                                                {p.radiologyDone ? '✓ Radiology Sent to Doctor' : 'Send Radiology to Doctor'}
                                              </button>
                                            </div>
                                        )}

                                        {/* ===== DIAGNOSTIC LAB SECTION (Path + Micro + Biochem + Other) ===== */}
                                        {diagLabEntries.length > 0 && (
                                            <div className="border-2 border-blue-200 rounded-lg p-3 bg-blue-50/40">
                                              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 px-2 py-1 rounded inline-block bg-blue-100 text-blue-700">
                                                Diagnostic Lab (Pathology / Microbiology / Biochemistry)
                                              </h3>
                                              <div className="space-y-2">
                                                {diagLabEntries.map(({ inv, idx }) => (
                                                    <div key={idx} className="border rounded-lg p-3 bg-white">
                                                      <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                        {inv}
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{getTestCategory(inv)}</span>
                                                      </h4>
                                                      {getTestParams(inv).map((param, pIdx) => (
                                                          <div key={pIdx} className="grid grid-cols-3 gap-2 items-center mb-2">
                                                            <span className="text-xs text-gray-600">{param.name}</span>
                                                            <input type="text" placeholder="Value" className="border rounded p-2 text-sm" id={`lab-val-${p.id}-${idx}-${pIdx}`} disabled={p.diagLabDone} />
                                                            <input type="text" defaultValue={param.ref} className="border rounded p-2 text-sm text-gray-600" id={`lab-ref-${p.id}-${idx}-${pIdx}`} disabled={p.diagLabDone} />
                                                          </div>
                                                      ))}
                                                    </div>
                                                ))}
                                              </div>

                                              <button
                                                  onClick={() => sendLabSection(p, 'diaglab')}
                                                  disabled={p.diagLabDone}
                                                  className={`w-full mt-3 py-2 rounded-lg text-sm font-bold ${p.diagLabDone ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                              >
                                                {p.diagLabDone ? '✓ Diagnostic Lab Sent to Doctor' : 'Send Diagnostic Lab to Doctor'}
                                              </button>
                                            </div>
                                        )}
                                      </div>
                                  );
                                })()}
                              </div>
                          ))}
                        </div>
                    )}
                  </div>
              )}

              {/* --- REVIEW TAB (Placeholder) --- */}

              {activeTab === 'review' && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 max-w-md mx-auto text-center">
                    <ClipboardCheck size={64} className="text-green-200"/>
                    <h2 className="text-xl font-bold text-gray-700">Final Medical Review</h2>
                    <p className="text-sm">This module is part of the extended EHR suite. It allows for discharge summaries.</p>
                  </div>
              )}

              {/* --- PHARMACY TAB --- */}
              {activeTab === 'pharmacy' && (
                  <div className="max-w-5xl mx-auto space-y-6">
                    <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                        <Pill size={24}/>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Pharmacy Dispensing</h3>
                        <p className="text-xs text-gray-500">Review prescriptions and dispense medication to
                          patients.</p>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border shadow-sm flex items-center gap-2">
                      <Search size={16} className="text-gray-400 shrink-0"/>
                      <input
                          type="text"
                          value={pharmacySearch}
                          onChange={(e) => setPharmacySearch(e.target.value)}
                          placeholder="Search by UHID or patient name..."
                          className="w-full outline-none text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div className="bg-white p-6 rounded-xl border shadow-sm mt-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Pharmacy Inventory</h3>

                          <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="New medicine name"
                                value={newMedName}
                                onChange={(e) => setNewMedName(e.target.value)}
                                className="border rounded p-2 text-sm flex-1"
                            />
                            <input
                                type="number"
                                placeholder="Initial stock"
                                value={newMedStock}
                                onChange={(e) => setNewMedStock(e.target.value)}
                                className="border rounded p-2 text-sm w-32"
                            />
                            <button
                                onClick={addNewMedicine}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                            >
                              + Add Medicine
                            </button>
                          </div>

                        <table className="w-full text-sm">
                          <thead>
                          <tr className="bg-gray-100 text-left">
                            <th className="p-2">Medicine</th>
                            <th className="p-2">Stock</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Action</th>
                          </tr>
                          </thead>
                          <tbody>
                          {inventory.map(item => (
                              <tr key={item.id} className="border-b">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2">
                                  {editingStockId === item.id ? (
                                      <input
                                          type="number"
                                          value={stockInput}
                                          onChange={(e) => setStockInput(e.target.value)}
                                          className="border px-2 py-1 w-20 rounded"
                                          autoFocus
                                      />
                                  ) : (
                                      item.stock
                                  )}
                                </td>
                                <td className="p-2">
                                  {item.stock <= item.lowStockThreshold ? (
                                      <span className="text-red-600 font-semibold">⚠️ Low Stock</span>
                                  ) : (
                                      <span className="text-green-600">✓ OK</span>
                                  )}
                                </td>
                                <td className="p-2">
                                  {editingStockId === item.id ? (
                                      <button
                                          onClick={() => updateStock(item.id, stockInput)}
                                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                      >
                                        Save
                                      </button>
                                  ) : (
                                      <button
                                          onClick={() => { setEditingStockId(item.id); setStockInput(item.stock.toString()); }}
                                          className="bg-gray-200 px-2 py-1 rounded text-xs"
                                      >
                                        Edit
                                      </button>
                                  )}
                                </td>
                              </tr>
                          ))}
                          </tbody>
                        </table>
                      </div>

                      {patients.filter(p => p.status === 'Pharmacy' && matchesSearch(p, pharmacySearch)).length === 0 ? (

                          <div
                              className="col-span-full bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center text-gray-500 flex flex-col items-center">
                            <CheckCircle2 size={48} className="text-green-300 mb-4"/>
                            <h3 className="text-lg font-medium text-gray-800">Queue Clear</h3>
                            <p className="text-sm mt-1">No pending prescriptions to dispense.</p>
                          </div>
                      ) : (
                          patients.filter(p => p.status === 'Pharmacy' && matchesSearch(p, pharmacySearch)).map(p => (

                              <div key={p.id}
                                   className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                                <div className="p-4 bg-gray-50 border-b flex justify-between items-start">
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{p.name}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{p.age} • {p.gender} •
                                      UHID: {p.uhid}</p>
                                    {p.diagnoses && p.diagnoses.length > 0 && (
                                        <div className="mt-2 text-xs">
                                          <span className="font-semibold text-gray-600 mr-1">Dx:</span>
                                          <span className="text-indigo-700 font-medium">{p.diagnoses.join(', ')}</span>
                                        </div>
                                    )}
                                  </div>
                                </div>

                                <div className="p-0 flex-1">
                                  <ul className="divide-y">
                                    {p.prescriptions && p.prescriptions.length > 0 ? p.prescriptions.map((med, idx) => (
                                        <li key={med.id || idx}
                                            className="p-3 px-4 hover:bg-slate-50 flex items-center justify-between">
                                          <div>
                                            <h5 className="font-bold text-sm text-gray-800">{med.name}</h5>
                                            <p className="text-xs text-gray-500 mt-0.5"><span
                                                className="font-semibold text-gray-700">{med.dosage}</span> for {med.duration}
                                            </p>
                                          </div>
                                          <input type="checkbox"
                                                 className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                                 defaultChecked/>
                                        </li>
                                    )) : (
                                        <li className="p-4 text-sm text-gray-500 italic">No medications prescribed.</li>
                                    )}
                                  </ul>
                                </div>

                                <div className="p-4 bg-white border-t flex justify-end gap-2">
                                  {p.admittedAt ? (
                                      // Aa patient IPD thi aavelu che — doctor e already discharge summary confirm kari didhi hase
                                      <button
                                          onClick={() => printDischargeSummary(p)}
                                          className="bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
                                      >
                                        🖨️ Print Discharge Summary
                                      </button>
                                  ) : (
                                      // Normal OPD patient — sāme che pahela ni jem
                                      <button
                                          onClick={() => printPrescription(p)}
                                          className="bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
                                      >
                                        🖨️ Print
                                      </button>
                                  )}
                                  <button
                                      onClick={() => dispenseMedication(p.id)}
                                      className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
                                  >
                                    <Check size={18}/> Dispense & Complete
                                  </button>
                                </div>

                              </div>
                          ))
                      )}
                    </div>
                  </div>
              )}
              {activeTab === 'settings' && (
                  <div className="max-w-2xl mx-auto space-y-4">
                    <h2 className="text-xl font-bold text-gray-700">Hospital / Print Settings</h2>
                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 uppercase">Hospital Name</label>
                        <input
                            type="text"
                            value={hospitalInfo.name}
                            onChange={(e) => updateHospitalInfo('name', e.target.value)}
                            className="w-full border rounded-lg p-2.5 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 uppercase">Address</label>
                        <input
                            type="text"
                            value={hospitalInfo.address}
                            onChange={(e) => updateHospitalInfo('address', e.target.value)}
                            className="w-full border rounded-lg p-2.5 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 uppercase">Doctor Name</label>
                        <input
                            type="text"
                            value={hospitalInfo.doctorName}
                            onChange={(e) => updateHospitalInfo('doctorName', e.target.value)}
                            className="w-full border rounded-lg p-2.5 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 uppercase">Contact Number</label>
                        <input
                            type="text"
                            value={hospitalInfo.contact}
                            onChange={(e) => updateHospitalInfo('contact', e.target.value)}
                            className="w-full border rounded-lg p-2.5 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 uppercase">Email id</label>
                        <input
                            type="text"
                            value={hospitalInfo.email}
                            onChange={(e) => updateHospitalInfo('email', e.target.value)}
                            className="w-full border rounded-lg p-2.5 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">
                          Doctor Digital Signature
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  updateHospitalInfo('doctorSign', reader.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full border rounded-lg p-2 text-sm bg-white"
                        />
                        {hospitalInfo.doctorSign && (
                            <div className="mt-2 flex items-center gap-3">
                              <img
                                  src={hospitalInfo.doctorSign}
                                  alt="Doctor Sign Preview"
                                  className="h-10 border rounded p-1 bg-white object-contain"
                              />
                              <button
                                  type="button"
                                  onClick={() => updateHospitalInfo('doctorSign', '')}
                                  className="text-xs text-red-600 font-semibold hover:underline"
                              >
                                Remove Sign
                              </button>
                            </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">This information appears on all printed prescriptions and bills.</p>

                      <button
                          onClick={saveHospitalSettings}
                          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700"
                      >
                        Save Settings
                      </button>

                    </div>
                  </div>
              )}
            </main>
          </div>
        </div>
    );
  }