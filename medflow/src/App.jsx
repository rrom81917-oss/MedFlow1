import React, { useState, useEffect } from 'react';
import {
  Activity, Users, Stethoscope, FlaskConical,
  ClipboardCheck, Pill, Search, Plus,
  ArrowRight, HeartPulse, BrainCircuit,
  CheckCircle2, AlertTriangle, User, LogOut,
  Sparkles, Trash2, Mic, FileText, Check, ChevronRight,
  ActivitySquare,Settings
} from 'lucide-react';

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

const ROLES = [
  { id: 'admin', label: 'Admin', username: 'admin', password: 'ramesh123', tabs: ['reception', 'nursing', 'doctor', 'lab', 'review', 'pharmacy','settings'] },
  { id: 'reception', label: 'Reception', username: 'reception', password: 'reception123', tabs: ['reception'] },
  { id: 'nursing', label: 'Nursing Station', username: 'nurse', password: 'nurse123', tabs: ['nursing'] },
  { id: 'doctor', label: 'Doctor / MO', username: 'doctor', password: 'doctor123', tabs: ['doctor'] },
  { id: 'lab', label: 'Laboratory', username: 'lab', password: 'lab123', tabs: ['lab'] },
  { id: 'pharmacy', label: 'Pharmacy', username: 'pharmacy', password: 'pharmacy123', tabs: ['pharmacy'] },
];
export default function MedFlowApp() {

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
  });
  const updateHospitalInfo = (field, value) => {
    setHospitalInfo(prev => ({ ...prev, [field]: value }));
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
You are an expert Consultant Physician AI. Based on the patient data below, suggest
relevant clinical documentation to help the doctor complete a thorough workup.

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
          model: 'llama-3.3-70b-versatile',
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

  const getTestParams = (testName) => {
    const found = Object.keys(LAB_TEST_PARAMS).find(key =>
        testName.toLowerCase().includes(key.toLowerCase().split(' (')[0].toLowerCase())
    );
    return found ? LAB_TEST_PARAMS[found] : [{ name: testName, ref: "" }];
  };
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('medflow_loggedIn') === 'true';
  });
  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem('medflow_role');
    return saved ? (saved) : null;
  });
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState('reception');
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('medflow_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  // Reception Modal State
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('');
  const [newPatientGender, setNewPatientGender] = useState('male');
  const [newPatientTriage, setNewPatientTriage] = useState('GREEN');
  const [newPatientOccupation, setNewPatientOccupation] = useState('');
  const [followUpUhid, setFollowUpUhid] = useState("");
  const [newPatientAddress, setNewPatientAddress] = useState('');

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
  const [prescriptions, setPrescriptions] = useState([]);
  const [aiRxLoading, setAiRxLoading] = useState(false);
  const [aiRxError, setAiRxError] = useState('');

  // Manual Medicine Input State
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('1-0-1');
  const [medDuration, setMedDuration] = useState('3 Days');

  // Pharmacy Inventory State
  const [inventory, setInventory] = useState([
    { id: 1, name: "Tab. Paracetamol 500mg", stock: 250, lowStockThreshold: 50 },
    { id: 2, name: "Tab. Rifampicin 600mg", stock: 30, lowStockThreshold: 40 },
    { id: 3, name: "Tab. Isoniazid 300mg", stock: 120, lowStockThreshold: 50 },
    { id: 4, name: "Tab. Pyrazinamide 1500mg", stock: 80, lowStockThreshold: 30 },
    { id: 5, name: "Tab. Ethambutol 1200mg", stock: 15, lowStockThreshold: 30 },
    { id: 6, name: "Inj. Streptomycin 1g IM", stock: 10, lowStockThreshold: 20 },
    { id: 7, name: "Tab. Amoxicillin 500mg", stock: 200, lowStockThreshold: 40 },
    { id: 8, name: "Tab. Azithromycin 500mg", stock: 100, lowStockThreshold: 30 },
    { id: 9, name: "Tab. Ciprofloxacin 500mg", stock: 150, lowStockThreshold: 40 },
    { id: 10, name: "Cap. Doxycycline 100mg", stock: 90, lowStockThreshold: 30 },
    { id: 11, name: "Tab. Metronidazole 400mg", stock: 180, lowStockThreshold: 40 },
    { id: 12, name: "Tab. Ibuprofen 400mg", stock: 200, lowStockThreshold: 40 },
    { id: 13, name: "Tab. Diclofenac 50mg", stock: 150, lowStockThreshold: 30 },
    { id: 14, name: "Tab. Omeprazole 20mg", stock: 220, lowStockThreshold: 40 },
    { id: 15, name: "Tab. Pantoprazole 40mg", stock: 180, lowStockThreshold: 40 },
    { id: 16, name: "Tab. Ranitidine 150mg", stock: 100, lowStockThreshold: 30 },
    { id: 17, name: "Tab. Ondansetron 4mg", stock: 120, lowStockThreshold: 30 },
    { id: 18, name: "Tab. Cetirizine 10mg", stock: 200, lowStockThreshold: 30 },
    { id: 19, name: "Tab. Amlodipine 5mg", stock: 150, lowStockThreshold: 30 },
    { id: 20, name: "Tab. Atenolol 50mg", stock: 100, lowStockThreshold: 30 },
    { id: 21, name: "Tab. Metformin 500mg", stock: 200, lowStockThreshold: 40 },
    { id: 22, name: "Tab. Glimepiride 2mg", stock: 100, lowStockThreshold: 30 },
    { id: 23, name: "Tab. Atorvastatin 10mg", stock: 150, lowStockThreshold: 30 },
    { id: 24, name: "Syp. Cough Syrup", stock: 80, lowStockThreshold: 20 },
    { id: 25, name: "ORS Sachets", stock: 300, lowStockThreshold: 50 },
    { id: 26, name: "IV Fluid NS 500ml", stock: 100, lowStockThreshold: 20 },
    { id: 27, name: "IV Fluid RL 500ml", stock: 100, lowStockThreshold: 20 },
    { id: 28, name: "Inj. Ceftriaxone 1g", stock: 60, lowStockThreshold: 20 },
    { id: 29, name: "Tab. Folic Acid 5mg", stock: 200, lowStockThreshold: 30 },
    { id: 30, name: "Tab. Iron (Ferrous Sulfate)", stock: 200, lowStockThreshold: 30 },
  ]);
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockInput, setStockInput] = useState("");
  const [newMedName, setNewMedName] = useState("");
  const [newMedStock, setNewMedStock] = useState("");

  useEffect(() => {
    localStorage.setItem('medflow_patients', JSON.stringify(patients));
  }, [patients]);
  const activePatient = patients.find(p => p.id === selectedPatientId);
  useEffect(() => {
    if (activePatient?.savedSymptoms) {
      setSelectedSymptoms(activePatient.savedSymptoms);
      setSelectedNegativeHistory(activePatient.savedNegativeHistory || []);
      setSelectedInvestigations(activePatient.savedInvestigations || []);
      setExamValues(activePatient.savedExamValues || {});
      setAiResult(activePatient.savedAiResult || null);
      setSelectedDdx(activePatient.savedSelectedDdx || []);
      setConsultStep('findings')
    } else {
      setSelectedSymptoms([]);
      setSelectedNegativeHistory([]);
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
  }, [selectedPatientId]);

// Make sure we have a selected patient if navigating to doctor tab
  useEffect(() => {
    if (activeTab === 'doctor' && !selectedPatientId) {
      const firstDocPt = patients.find(p => p.status === 'Doctor');
      if (firstDocPt) setSelectedPatientId(firstDocPt.id);
    }
  }, [activeTab, patients, selectedPatientId]);

  // --- Reception Actions ---
  const searchFollowUpPatient = (query) => {
    if (!query.trim()) {
      setNewPatientName('');
      setNewPatientAge('');
      setNewPatientGender('male');
      setNewPatientAddress('');
      setNewPatientOccupation('');
      return;
    }
    const q = query.trim().toLowerCase();
    const found = patients.find(p =>
        p.uhid.toLowerCase() === q || p.name.toLowerCase().includes(q)
    );
    if (found) {
      setNewPatientName(found.name);
      setNewPatientAge(found.age.replace('y', ''));
      setNewPatientGender(found.gender);
    } else {
      setNewPatientName('');
      setNewPatientAge('');
    }
  };
  const handleAddPatient = (e) => {
    e.preventDefault();

    // Follow-up: reactivate existing patient by UHID or name
    if (followUpUhid.trim()) {
      const q = followUpUhid.trim().toLowerCase();
      const existing = patients.find(p =>
          p.uhid.toLowerCase() === q || p.name.toLowerCase().includes(q)
      );
      if (existing) {
        setPatients(patients.map(p =>
            p.id === existing.id
                ? {
                  ...p,
                  status: 'Nursing',
                  complaint: newPatientOccupation || 'Follow-up visit',
                  triage: newPatientTriage,
                  vitals: null,
                }
                : p
        ));
        setFollowUpUhid("");
        setNewPatientName('');
        setNewPatientAge('');
        setNewPatientOccupation('');
        setNewPatientAddress('');
        setShowAddPatientModal(false);
        return;
      } else {
        alert("No patient found with this UHID or name.");
        return;
      }
    }

    // New patient
    if (!newPatientName.trim()) return;
    const newPt = {
      id: `#${Math.floor(Math.random() * 90 + 10)}`,
      name: newPatientName,
      age: `${newPatientAge}y`,
      gender: newPatientGender,
      uhid: `EHR${Math.floor(Math.random() * 900000 + 100000)}`,
      triage: newPatientTriage,
      status: 'Nursing',
      occupation: newPatientOccupation || '',
      address: newPatientAddress || '',
      vitals: null,
    };
    setPatients([newPt, ...patients]);
    setNewPatientName('');
    setNewPatientAge('');
    setNewPatientOccupation('');
    setNewPatientAddress('');
    setShowAddPatientModal(false);
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
    setPatients(patients.map(p => p.id === patientId ? { ...p, status: 'Doctor', vitals } : p));
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
    const promptText = `
      You are an expert Consultant Physician AI referencing standard medical textbooks (e.g., Harrison's Principles of Internal Medicine, Bailey & Love's Short Practice of Surgery, Williams Obstetrics).
      
      Patient Profile: ${activePatient?.age}, ${activePatient?.gender}.
      Occupation: ${activePatient?.occupation}.
      Selected Clinical Findings & Symptoms: ${symNames}.
Doctor's Manual History: ${manualHistory || 'Not provided'}.
Negative History: ${selectedNegativeHistory.join(', ') || 'None confirmed'}.
Investigations Ordered: ${selectedInvestigations.join(', ') || 'None selected'}.
General Examination Findings: ${
        Object.entries(examValues)
            .filter(([name]) => examSuggestions?.generalExamination?.some(p => p.name === name))
            .map(([name, val]) => `${name}: ${val}`)
            .join(', ') || 'Not documented'
    }.
Systemic Examination Findings: ${
        Object.entries(examValues)
            .filter(([name]) => examSuggestions?.systemicExamination?.some(p => p.name === name))
            .map(([name, val]) => `${name}: ${val}`)
            .join(', ') || 'Not documented'
    }.
${activePatient?.labResults ? `Lab Investigation Results: ${activePatient.labResults}.` : ''}
      
Based on the complete patient summary above (symptoms, manual history, negative history, examination findings, and investigations), and standard modern medicine textbook provide a highly accurate Provisional Differential Diagnosis (top 3-4 conditions, ranked by likelihood) and suggest any additional standard laboratory/radiological investigations not already ordered.
      
      You MUST return your response as a valid JSON object matching exactly this schema (do not include markdown block ticks around it):
      {
        "ddx": ["Diagnosis 1", "Diagnosis 2", "Diagnosis 3"],
        "labs": ["Investigation 1", "Investigation 2", "Investigation 3"]
      }
    `;


    const grokApiUrl = "https://api.groq.com/openai/v1/chat/completions";

    try {
      const response = await fetch(grokApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          response_format: {type: "json_object"},
          messages: [
            {
              role: "user",
              content: promptText
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
    setPatients(patients.map(p =>
        p.id === activePatient.id
            ? {
              ...p,
              status: 'Doctor',
              labStatus: 'Pending',
              investigationsOrdered: mergedInvestigations,
              savedNegativeHistory: selectedNegativeHistory || [],
              savedInvestigations: mergedInvestigations,
              savedExamValues: examValues || {},
              savedSymptoms: selectedSymptoms,
              savedAiResult: aiResult,
              savedSelectedDdx: selectedDdx,
            }
            : p
    ));
    setSelectedPatientId(null);
  };

  const sendToLab = () => {
    if (!activePatient) return;
    setPatients(patients.map(p =>
        p.id === activePatient.id
            ? {
              ...p,
              status: 'Doctor', // દર્દી ડૉક્ટર પેનલમાં જ રહેશે
              labStatus: 'Pending', // લેબ વાળા માટે નવું સ્ટેટસ
              investigationsOrdered: selectedInvestigations || [],
              savedNegativeHistory: selectedNegativeHistory || [],
              savedInvestigations: selectedInvestigations || [],
              savedExamValues: examValues || {},
              savedSymptoms: selectedSymptoms,
              savedAiResult: aiResult,
              savedSelectedDdx: selectedDdx,
            }
            : p
    ));

  };

  const saveLabResults = (patientId, resultsText) => {
    setPatients(patients.map(p =>
        p.id === patientId
            ? {
              ...p,
              labResults: resultsText,
              status: 'Doctor',
              labStatus: 'Completed' // આનાથી દર્દી લેબમાંથી ક્લિયર થઈ જશે
            }
            : p
    ));
  };

    const acceptDiagnosis = () => {
      if (selectedDdx.length === 0) return;
      setAcceptedDiagnosis(selectedDdx);
      setConsultStep('plan');
    };

    const generateAIPrescription = async () => {
      if (acceptedDiagnosis.length === 0) return;
      setAiRxLoading(true);
      setAiRxError('');

      const diagnosisList = acceptedDiagnosis.join(', ');
      const promptText = `
      You are an expert physician writing a standard, evidence-based prescription.
      Patient Profile: ${activePatient?.age}, ${activePatient?.gender}.
      Final Diagnosis: ${diagnosisList}.
      
      Generate a standard, safe medical prescription (pharmacological treatment) appropriate for this diagnosis based on current clinical guidelines.
      Include proper drug names, dosages, durations, and instructions.
      
      You MUST return your response as a valid JSON object matching exactly this schema (no markdown formatting):
      {
        "medications": [
          {
            "name": "Full drug name and strength (e.g., Tab. Paracetamol 500mg)",
            "dosage": "e.g., 1-0-1 or STAT",
            "duration": "e.g., 3 Days",
            "note": "e.g., After meals"
          }
        ]
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
            model: "llama-3.3-70b-versatile",
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
        const newMeds = parsedResult.medications.map((m, index) => ({
          id: Date.now() + index,
          ...m
        }));
        setPrescriptions(newMeds);
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

    const finishConsultation = () => {
      if (!activePatient) return;
      setPatients(patients.map(p => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            status: 'Pharmacy',
            diagnoses: acceptedDiagnosis,
            prescriptions: prescriptions
          };
        }
        return p;
      }));
      setSelectedPatientId(null);
      setActiveTab('pharmacy');
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

  const updateStock = (id, newStock) => {
    setInventory(inventory.map(item =>
        item.id === id ? { ...item, stock: parseInt(newStock) || 0 } : item
    ));
    setEditingStockId(null);
    setStockInput("");
  };
  const addNewMedicine = () => {
    if (!newMedName.trim()) return;
    setInventory([
      ...inventory,
      {
        id: Date.now(),
        name: newMedName.trim(),
        stock: parseInt(newMedStock) || 0,
        lowStockThreshold: 30,
      },
    ]);
    setNewMedName("");
    setNewMedStock("");
  };

    const printPrescription = (patient) => {
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
            
            <p style="text-align: left;"><b>Patient:</b> ${patient.name}&nbsp;&nbsp;|&nbsp;&nbsp;<b>Age/Sex:</b> ${patient.age} / ${patient.gender}</p>
            <p style="margin:2px 0; font-size:13px;">${patient.address}</p>
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
            <br/><br/>
            <p style="text-align:right;">Doctor's Signature: ___________________</p>
        </body>
        </html>
    `);
      printWindow.document.close();
      printWindow.print();
    };
  const handleLogin = (e) => {
    e.preventDefault();
    const role = ROLES.find(
        r => r.username === loginUsername && r.password === loginPassword
    );
    if (role) {
      setCurrentRole(role);
      setIsLoggedIn(true);
      setLoginError("");
      setActiveTab(role.tabs[0]);
      localStorage.setItem('medflow_loggedIn', 'true');
      localStorage.setItem('medflow_role', JSON.stringify(role));
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentRole(null);
    setLoginUsername("");
    setLoginPassword("");
    localStorage.removeItem('medflow_loggedIn');
    localStorage.removeItem('medflow_role');
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
              Demo: admin/admin123, reception/reception123, nurse/nurse123, doctor/doctor123, lab/lab123, pharmacy/pharmacy123
            </p>
          </form>
        </div>
    );
  }
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
          {/* Sidebar */}
          <div className="w-64 bg-[#1e2330] flex flex-col justify-between text-white flex-shrink-0 shadow-lg z-10 md:flex hidden">
            <div className="p-4 flex items-center space-x-3 border-b border-slate-700">
              <Activity className="text-blue-400 w-6 h-6"/>
              <div>
                <h1 className="font-bold text-lg leading-tight">MedFlow AI</h1>
                <p className="text-xs text-slate-400">Hospital Workflow Made PR</p>
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
              <div className="text-xs text-slate-400 mb-2">Logged in as: <span className="font-semibold text-white">{currentRole?.label}</span></div>
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
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                        {patients.filter(p => p.status !== 'Discharged').map(p => (
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
                                      p.status === 'Pharmacy' ? 'bg-purple-100 text-purple-700' :
                                          'bg-slate-100 text-slate-800'
                          }`}>
                            {p.status}
                          </span>
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
                              <button onClick={() => setShowAddPatientModal(false)}
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
                                <label
                                    className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Address</label>
                                <input
                                    type="text"
                                    value={newPatientAddress}
                                    onChange={e => setNewPatientAddress(e.target.value)}
                                    placeholder="e.g., Village, Taluka, District"
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
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
                                    onClick={() => setShowAddPatientModal(false)}
                                    className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                  Register Patient
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {patients.filter(p => p.status === 'Nursing').length === 0 ? (
                          <div
                              className="col-span-full bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                            <ActivitySquare className="w-12 h-12 mx-auto text-gray-300 mb-3"/>
                            <p className="font-medium">No patients currently at the Nursing Station.</p>
                            <p className="text-xs mt-1">Patients registered at Reception will appear here.</p>
                          </div>
                      ) : (
                          patients.filter(p => p.status === 'Nursing').map(p => (
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
                    <div
                        className="bg-white rounded-xl border shadow-sm p-3 flex flex-wrap gap-2 items-center overflow-x-auto">
                      <span className="text-xs font-semibold text-gray-500 uppercase px-2">Waiting:</span>
                      {patients.filter(p => p.status === 'Doctor').length === 0 ? (
                          <span className="text-sm text-gray-500 italic">No patients in queue</span>
                      ) : (
                          patients.filter(p => p.status === 'Doctor').map(p => (
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
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-0">
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

                              <div className="p-4 bg-gray-20">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Occupation</h4>
                                <p className="text-sm font-medium text-gray-800">{activePatient.occupation}</p>
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
                              className="lg:col-span-2 bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden h-[600px] lg:h-auto">

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
                                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        Manual History & Symptoms/Complaint
                                      </label>
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
                                            Negative History (tap to confirm)
                                          </h4>
                                          <div className="flex flex-wrap gap-2">
                                            {examSuggestions.negativeHistory.map((item, i) => {
                                              const isChecked = selectedNegativeHistory.includes(item);
                                              return (
                                                  <button
                                                      key={i}
                                                      onClick={() => toggleNegativeHistory(item)}
                                                      className={`px-3 py-1.5 rounded-full text-sm border ${
                                                          isChecked
                                                              ? 'bg-green-100 text-green-800 border-green-300'
                                                              : 'bg-white text-gray-600 border-gray-300 hover:border-green-300'
                                                      }`}
                                                  >
                                                    {isChecked ? '✓ ' : ''}{item}
                                                  </button>
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
                                                      placeholder={`Normal: ${param.normalRange}`}
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
                                        </div>
                                    )}

                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Examination Findings</h4>

                                      {examSuggestions ? (
                                          <div className="grid grid-cols-2 gap-2">

                                            {examSuggestions.generalExamination?.map((param, i) => {
                                              const displayValue = examValues[param.name] || `Normal: ${param.normalRange}`;
                                              return (
                                                  <p key={`gen-${i}`} className="text-sm text-gray-800">
                                                    <span className="text-gray-500">{param.name}:</span> {displayValue}
                                                  </p>
                                              );
                                            })}

                                            {examSuggestions.systemicExamination?.map((param, i) => {
                                              const displayValue = examValues[param.name] || `Normal: ${param.normalRange}`;
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
                                          <button onClick={acceptDiagnosis} disabled={selectedDdx.length === 0} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm">
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

                                  <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                    {aiRxError && (
                                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex gap-2 items-center">
                                          <AlertTriangle size={16}/> {aiRxError}
                                        </div>
                                    )}

                                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                      <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                                        <h4 className="text-sm font-bold text-gray-700 uppercase">Prescription (<span className="text-xl font-serif text-gray-400 italic font-normal mr-1 pr-1 border-r">Rx</span>)</h4>
                                      </div>
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
                                  </div>

                                  <div className="p-4 bg-white border-t flex justify-between gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                    <button onClick={() => setConsultStep('diagnosis')} className="bg-white border text-gray-600 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50">
                                      ← Back
                                    </button>
                                    <div className="flex items-center gap-4">
                                      <button onClick={() => printPrescription(activePatient)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                                        Print Case Paper
                                      </button>
                                      <button onClick={finishConsultation} className="bg-green-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm">
                                        <CheckCircle2 size={18}/> Send to Pharmacy
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

              {/* --- LAB TAB (Real) --- */}
              {activeTab === 'lab' && (
                  <div className="max-w-3xl mx-auto space-y-4">
                    <h2 className="text-xl font-bold text-gray-700">Laboratory</h2>
                    {patients.filter(p => p.labStatus === 'Pending').length === 0 ? (
                        <div className="bg-white p-8 rounded-xl border text-center text-gray-400">
                          No patients waiting for lab results.
                        </div>
                    ) : (
                        patients.filter(p => p.labStatus === 'Pending').map(p => (
                            <div key={p.id} className="bg-white p-4 rounded-xl border shadow-sm">
                              <h3 className="font-bold">{p.name} <span className="text-sm text-gray-500">({p.age}y, {p.gender})</span></h3>
                              <p className="text-sm text-gray-600 mb-2">Investigations ordered: {(p.investigationsOrdered || []).join(', ') || 'General'}</p>
                              <div className="space-y-2 mb-3">
                                {(p.investigationsOrdered && p.investigationsOrdered.length > 0 ? p.investigationsOrdered : ['General Test']).map((inv, idx) => (
                                    <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                                      <h4 className="text-sm font-bold text-gray-700 mb-2">{inv}</h4>
                                      {getTestParams(inv).map((param, pIdx) => (
                                          <div key={pIdx} className="grid grid-cols-3 gap-2 items-center mb-2">
                                            <span className="text-xs text-gray-600">{param.name}</span>
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                className="border rounded p-2 text-sm"
                                                id={`lab-val-${p.id}-${idx}-${pIdx}`}
                                            />
                                            <input
                                                type="text"
                                                defaultValue={param.ref}
                                                className="border rounded p-2 text-sm text-gray-600"
                                                id={`lab-ref-${p.id}-${idx}-${pIdx}`}
                                            />
                                          </div>
                                      ))}
                                    </div>
                                ))}
                              </div>
                              <button
                                  onClick={() => {
                                    const invList = p.investigationsOrdered && p.investigationsOrdered.length > 0 ? p.investigationsOrdered : ['General Test'];
                                    const combined = invList.map((inv, idx) => {
                                      const params = getTestParams(inv);
                                      const paramResults = params.map((param, pIdx) => {
                                        const val = document.getElementById(`lab-val-${p.id}-${idx}-${pIdx}`).value;
                                        const ref = document.getElementById(`lab-ref-${p.id}-${idx}-${pIdx}`).value;
                                        return `${param.name}: ${val || 'N/A'} (Ref: ${ref || 'N/A'})`;
                                      }).join(', ');
                                      return `${inv} [${paramResults}]`;
                                    }).join('; ');
                                    saveLabResults(p.id, combined);
                                  }}
                                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                              >
                                Save & Send Back to Doctor
                              </button>
                            </div>
                        ))

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
                      {patients.filter(p => p.status === 'Pharmacy').length === 0 ? (
                          <div
                              className="col-span-full bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center text-gray-500 flex flex-col items-center">
                            <CheckCircle2 size={48} className="text-green-300 mb-4"/>
                            <h3 className="text-lg font-medium text-gray-800">Queue Clear</h3>
                            <p className="text-sm mt-1">No pending prescriptions to dispense.</p>
                          </div>
                      ) : (
                          patients.filter(p => p.status === 'Pharmacy').map(p => (
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
                                  <div className="p-4 bg-white border-t flex justify-end gap-2">
                                    <button
                                        onClick={() => printPrescription(p)}
                                        className="bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
                                    >
                                      🖨️ Print
                                    </button>
                                    <button
                                        onClick={() => dispenseMedication(p.id)}
                                        className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
                                    >
                                      <Check size={18}/> Dispense & Complete
                                    </button>
                                  </div>
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
                      <p className="text-xs text-gray-400">This information appears on all printed prescriptions and bills.</p>
                    </div>
                  </div>
              )}
            </main>
          </div>
        </div>
    );
  }