# Genetics hub — how to edit

The homepage (`index.html`) reads all of its sections and cards from **`data.json`**.
To change what appears on the page, you edit `data.json`. You do **not** need to touch `index.html`.

After you save `data.json` on GitHub, the live site updates on its own within a minute or two.

---

## The three parts of data.json

```json
{
  "reviewed": "2026-06",
  "groups": [ ... ],
  "protocols": [ ... ]
}
```

- **reviewed** — the "last reviewed" date shown on the page. Format: `"YYYY-MM"`.
- **groups** — the sections, in the order they appear on the page.
- **protocols** — the cards.

---

## Add a new card

Find the `"protocols"` list and add an entry. Put it next to other cards in the
same section so it appears where you expect. A card looks like this:

```json
{
  "group": "cancer",
  "file": "brca1.html",
  "title": "BRCA1",
  "desc": { "en": "Breast, ovarian and related risk", "fr": "Risque de cancer du sein, de l'ovaire et apparentés" }
}
```

Field by field:

- **group** — which section it belongs to. Use one of the `key` values from `groups`
  (for example `learn`, `tests`, `derm`, `connective`, `cancer`, `adult`, `cardiac`,
  `prenatal`, `pediatric`).
- **file** — the protocol file the card opens, e.g. `"brca1.html"`. It must be a file
  in the same folder. The card opens it in a new tab.
- **title** — the name on the card. Either a plain string (`"BRCA1"`) or a bilingual
  pair (`{ "en": "...", "fr": "..." }`).
- **desc** — the one-line description under the title. Bilingual `{ "en": "...", "fr": "..." }`.

### Optional extras on a card

- **reviewed** — `"YYYY-MM"` to give one card its own review date instead of the page default.
- **subheadBefore** / **subheadAfter** — `{ "en": "...", "fr": "..." }` to print a small
  divider label before or after the card (used in "Types of tests").

---

## Edit or remove a card

- **Edit**: change the text inside the quotes and save.
- **Remove**: delete the whole `{ ... }` block for that card, including its trailing comma.

---

## Add or edit a section

Sections are in the `"groups"` list, in display order. A section looks like:

```json
{
  "key": "cardiac",
  "label": { "en": "Cardiac genetics", "fr": "Génétique cardiaque" },
  "blurb": { "en": "Inherited heart-rhythm and heart-muscle conditions ...", "fr": "..." }
}
```

- **key** — a short id used to link cards to this section. Lowercase, no spaces.
- **label** — the section heading, bilingual.
- **blurb** — OPTIONAL short paragraph under the heading, bilingual. Leave it out if not needed.

To **reorder** sections, move their blocks up or down in the `"groups"` list.

---

## Two rules that prevent 99% of problems

1. **Commas.** Every entry in a list is separated by a comma, but the **last** entry
   has **no** comma after it. If the page goes blank after an edit, a stray or missing
   comma is the usual cause.
2. **Quotes.** All text and field names go in straight double quotes `"like this"`.

If you want to be sure your file is valid before saving, paste it into a free
JSON checker (search "JSON validator") — it will point to the exact line of any typo.

---

## A note on new files

Adding a card does not create the protocol document. If a card points to
`marfan.html` and that file does not exist yet, the card will show but clicking it
will give a "not found" page until you add `marfan.html` to the folder.

---

# The patient guide (counselling-guide.html)

`counselling-guide.html` is a **patient-facing** page. Patients open it before their
appointment, choose why they were referred, read a short plain-language explanation,
and complete the questionnaire(s) they need to fill in. It is reached from the
"Getting ready for your appointment" button near the top of the main page.

It carries no patient data itself; the questionnaires open in JotForm, where answers
are handled. Its content lives in **`counselling.json`**, edited like `data.json`.

Each referral type looks like this:

```json
{
  "key": "cancer",
  "accent": "cancer",
  "label":   { "en": "Cancer genetics", "fr": "..." },
  "summary": { "en": "Family or personal history of cancer", "fr": "..." },
  "about":   { "en": "You have been referred because ...", "fr": "..." },
  "expect":  { "en": "We will review your history ...", "fr": "..." },
  "primers": [ { "label": { "en": "Cancer genetics 101", "fr": "..." }, "anchor": "cancer-genetics-101" } ],
  "questionnaires": [
    {
      "who":   { "en": "Please complete this questionnaire", "fr": "..." },
      "note":  { "en": "It asks about your health and family history.", "fr": "..." },
      "forms": { "en": "250616161210240", "fr": "250643846636262" }
    }
  ]
}
```

Field by field:

- **about** / **expect** — the two plain-language paragraphs the patient reads. Keep
  them reassuring and jargon-free.
- **primers** — the "Learn more before your visit" chips. Each chip links to one of three
  kinds of destination on the main page:
    - `"anchor": "genetics-101"` — opens an in-page primer (Genetics 101, What to expect,
      Cascade testing, Genetic privacy, Cancer genetics 101, Possible results, etc.)
    - `"file": "gene-panel.html"` — opens a specific card page (gene panels, liquid biopsy,
      skin biopsy, an individual gene page, etc.)
    - `"section": "cancer"` — jumps to the main page and opens a whole section
      (e.g. all the hereditary cancer syndromes). Use the section key: `cancer`, `tests`,
      `connective`, `adult`, `cardiac`, `prenatal`, `pediatric`, `derm`, `learn`.
- **questionnaires** — a list. Most referral types have ONE. Each questionnaire has:
  - **who** — who should fill it out (shown in bold on the button card).
  - **note** — a short description of what the questionnaire asks.
  - **forms** — the JotForm numbers by language: `"en"` is the English (JGH) form,
    `"fr"` is the French (HGJ) form. The page opens whichever matches the EN/FR toggle.
- **accent** — colour stripe: `cancer`, `adult`, `prenatal`, `pediatric`, or `connective`.

## Prenatal has two questionnaires

Prenatal is the one type with TWO entries in `questionnaires`: the mother completes the
prenatal questionnaire and the father completes the adult questionnaire. They appear as
two labelled cards. To change either, edit that entry's `forms` numbers. The pattern
generalises: any referral type can have more than one questionnaire by adding entries
to its `questionnaires` list.

The wording in `about`, `expect`, and `note` was drafted as a starting point and should
be reviewed so it matches how you want patients to be addressed.
