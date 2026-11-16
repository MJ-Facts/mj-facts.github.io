
/*
=========================================================
 MINISEARCH ENGINE
 OPTIMISED COMPLETE REPLACEMENT
 BOOTSTRAP STUDIO COMPATIBLE
=========================================================

 SEARCH ENGINE:
 - MiniSearch 7.1.2

 FEATURES:
 - Automatic MiniSearch loading
 - Full name and nickname recognition
 - Extensive male and female name variations
 - Multiple nickname searches
 - Apostrophe-insensitive searching
 - Prefix matching
 - Fuzzy matching
 - Article title prioritisation
 - Relevant search snippets
 - Search term highlighting
 - Duplicate result prevention
 - Original article database compatibility
 - Existing HTML and CSS compatibility
 - No automatic page scrolling

=========================================================
*/


// =======================================================
// 1. CONFIGURATION
// =======================================================

let pagesIndex = [];
let searchIndex = null;
let pageById = new Map();

const MAX_RESULTS = 15;
const MAX_SUMMARY_LENGTH = 180;
const MAX_SNIPPET_SENTENCES = 3;
const MAX_NAME_VARIATIONS = 64;

const MIN_PREFIX_LENGTH = 3;
const MIN_FUZZY_LENGTH = 5;
const FUZZY_DISTANCE = 0.2;

const MINISEARCH_URL =
    "https://cdn.jsdelivr.net/npm/minisearch@7.1.2/dist/umd/index.min.js";

const SENTENCE_REGEX = /[^.!?]+[.!?]?/g;

const APOSTROPHE_REGEX =
    /['\u2018\u2019\u02BC\uFF07\u02BB\u02B9\u055A\uA78C]/gu;

const APOSTROPHE_HIGHLIGHT_REGEX =
    "['\u2018\u2019\u02BC\uFF07\u02BB\u02B9\u055A\uA78C]?";


// =======================================================
// 2. NAME SYNONYMS AND NICKNAME RECOGNITION
// =======================================================

const NAME_SYNONYMS = [

    // MALE NAMES

    ["tom", "thomas", "tommy", "tommie"],
    ["dave", "david", "davey", "davy"],
    ["mike", "michael", "mikey", "mick"],
    ["bill", "william", "billy", "will", "willy"],
    ["bob", "robert", "bobby", "rob", "robbie"],
    ["jim", "james", "jimmy", "jamie"],
    ["tony", "anthony", "ant"],
    ["dan", "daniel", "danny"],
    ["chris", "christopher"],
    ["matt", "matthew", "matty"],
    ["steve", "stephen", "steven", "stevie"],
    ["andy", "andrew", "drew"],
    ["alex", "alexander", "alexandra", "alexis"],
    ["nick", "nicholas", "nicky", "nik"],
    ["joe", "joseph", "joey"],
    ["ben", "benjamin", "benny"],
    ["charlie", "charles", "chuck", "chaz"],
    ["harry", "henry", "harold"],
    ["sam", "samuel", "sammy"],
    ["pete", "peter", "petey"],
    ["rick", "richard", "ricky", "dick"],
    ["rich", "richard", "rick"],
    ["ted", "edward", "theodore", "teddy"],
    ["ed", "edward", "eddie"],
    ["fred", "frederick", "freddie"],
    ["frank", "francis", "frankie"],
    ["ray", "raymond"],
    ["ron", "ronald", "ronnie"],
    ["ken", "kenneth", "kenny"],
    ["larry", "lawrence"],
    ["gary", "garry"],
    ["greg", "gregory"],
    ["jeff", "jeffrey", "geoff"],
    ["phil", "philip", "phillip"],
    ["pat", "patrick", "paddy"],
    ["sean", "shaun", "shawn"],
    ["jon", "jonathan"],
    ["brian", "bryan"],
    ["max", "maxwell", "maximilian"],
    ["leo", "leonard", "leon"],
    ["al", "alan", "albert"],
    ["gerry", "gerald", "gerard"],
    ["mo", "maurice"],
    ["percy", "percival"],
    ["archie", "archibald"],
    ["alfie", "alfred"],
    ["monty", "montgomery"],
    ["stan", "stanley"],
    ["les", "leslie"],
    ["cliff", "clifford"],
    ["doug", "douglas"],
    ["don", "donald"],
    ["trev", "trevor"],
    ["terry", "terence"],
    ["nig", "nigel"],
    ["wilf", "wilfred"],
    ["ernie", "ernest"],
    ["reg", "reginald"],
    ["bert", "albert", "herbert"],
    ["herb", "herbert"],
    ["gus", "augustus", "angus"],
    ["zack", "zach", "zachary"],
    ["lenny", "leonard"],
    ["marty", "martin"],
    ["vince", "vincent"],
    ["walt", "walter"],
    ["wally", "walter"],
    ["barry", "barrie"],
    ["brad", "bradley"],
    ["cal", "callum", "calvin"],
    ["cam", "cameron"],
    ["eli", "elijah"],
    ["karl", "carl"],
    ["lee", "leigh"],
    ["manny", "manuel", "emmanuel"],
    ["matt", "matthias"],
    ["rob", "robert", "robbie", "bobby"],
    ["will", "william", "willy", "billy"],
    ["joey", "joseph"],
    ["paddy", "patrick"],
    ["nate", "nathan", "nathaniel"],
    ["tim", "timothy", "timmy"],
    ["vin", "vincent"],
    ["winnie", "winifred"],
    ["zeb", "zebedee"],

    // FEMALE NAMES

    ["liz", "elizabeth", "lizzie", "beth", "betty"],
    ["kate", "katherine", "catherine", "kathy", "katie"],
    ["jen", "jennifer", "jenny", "jenn"],
    ["becky", "rebecca"],
    ["mandy", "amanda"],
    ["sue", "susan", "susie"],
    ["maggie", "margaret", "meg", "peggy"],
    ["deb", "deborah", "debbie"],
    ["vicky", "victoria"],
    ["chrissy", "christina", "christine"],
    ["jo", "joanne", "joanna", "josephine"],
    ["kim", "kimberly"],
    ["ronnie", "veronica"],
    ["steph", "stephanie"],
    ["sally", "sarah"],
    ["sandy", "sandra"],
    ["cathy", "catherine", "katherine"],
    ["trish", "patricia", "tricia"],
    ["penny", "penelope"],
    ["polly", "mary"],
    ["molly", "mary"],
    ["milly", "millicent"],
    ["nell", "eleanor", "ellen"],
    ["nellie", "eleanor", "ellen"],
    ["dolly", "dorothy"],
    ["dot", "dorothy"],
    ["dotty", "dorothy"],
    ["gill", "gillian"],
    ["jill", "jillian"],
    ["lou", "louise"],
    ["lucy", "lucinda"],
    ["mimi", "mary"],
    ["nicky", "nicole"],
    ["tess", "theresa", "teresa"],
    ["terri", "teresa"],
    ["wendy", "gwendolyn"],
    ["ellie", "eleanor", "ellen", "elena"],
    ["abby", "abigail"],
    ["annie", "ann", "anna"],
    ["angie", "angela"],
    ["bella", "isabella"],
    ["carrie", "caroline", "carol"],
    ["daisy", "margaret"],
    ["fran", "frances"],
    ["frankie", "frances"],
    ["grace", "gracie"],
    ["izzy", "isabel", "isabella"],
    ["lottie", "charlotte"],
    ["maddie", "madeline", "madison"],
    ["millie", "millicent"],
    ["rosie", "rose", "rosemary"],
    ["sasha", "alexandra"],
    ["tina", "christina"],
    ["val", "valerie"],
    ["vi", "violet"],
    ["evie", "eve", "evelyn"],
    ["lily", "lillian"],
    ["katie", "kate", "katherine", "catherine"],
    ["meg", "megan"],
    ["minnie", "wilhelmina"],
    ["pippa", "philippa"],
    ["rachel", "rach"],
    ["suzie", "susan", "suzanne"],
    ["thea", "dorothea"],
    ["tori", "victoria"],
    ["vivi", "vivian", "vivienne"]

];


// =======================================================
// 3. BUILD NICKNAME LOOKUP
// =======================================================

const NAME_SYNONYM_LOOKUP = new Map();

NAME_SYNONYMS.forEach(group => {

    const uniqueNames = [...new Set(group)];

    uniqueNames.forEach(name => {

        const existing =
            NAME_SYNONYM_LOOKUP.get(name) || [];

        NAME_SYNONYM_LOOKUP.set(
            name,
            [...new Set([...existing, ...uniqueNames])]
        );

    });

});


// =======================================================
// 4. TEXT NORMALISATION
// =======================================================

function normaliseSearchText(text) {

    return String(text ?? "")

        .normalize("NFKC")

        .toLowerCase()

        .replace(APOSTROPHE_REGEX, "")

        .replace(/[^\p{L}\p{N}\s]/gu, " ")

        .replace(/\s+/g, " ")

        .trim();

}


// =======================================================
// 5. SEARCH TERM PROCESSING
// =======================================================

function getUniqueSearchTerms(query) {

    return [

        ...new Set(

            normaliseSearchText(query)

                .split(/\s+/)

                .filter(Boolean)

        )

    ];

}


function getNameAlternatives(term) {

    return NAME_SYNONYM_LOOKUP.get(term) || [term];

}


function getExpandedSearchTerms(query) {

    const terms = getUniqueSearchTerms(query);

    const expanded = new Set(terms);

    terms.forEach(term => {

        getNameAlternatives(term).forEach(alternative => {

            expanded.add(alternative);

        });

    });

    return [...expanded];

}


// =======================================================
// 6. GENERATE NICKNAME SEARCH VARIATIONS
// =======================================================

function getSearchVariations(
    terms,
    maximum = MAX_NAME_VARIATIONS
) {

    if (!terms.length) {

        return [];

    }

    const combinations = [[]];

    for (const term of terms) {

        const alternatives = [

            term,

            ...getNameAlternatives(term).filter(
                name => name !== term
            )

        ];

        const next = [];

        for (const existing of combinations) {

            for (const alternative of alternatives) {

                if (next.length >= maximum) {

                    break;

                }

                next.push([

                    ...existing,

                    alternative

                ]);

            }

            if (next.length >= maximum) {

                break;

            }

        }

        combinations.length = 0;

        combinations.push(...next);

    }

    return combinations;

}


// =======================================================
// 7. LOAD MINISEARCH
// =======================================================

function loadMiniSearch() {

    if (typeof MiniSearch !== "undefined") {

        return Promise.resolve();

    }

    if (window.__miniSearchPromise) {

        return window.__miniSearchPromise;

    }

    window.__miniSearchPromise = new Promise(
        (resolve, reject) => {

            const existingScript = document.querySelector(
                'script[src="' + MINISEARCH_URL + '"]'
            );

            const script = existingScript ||
                document.createElement("script");

            const checkLoaded = () => {

                if (typeof MiniSearch !== "undefined") {

                    resolve();

                } else {

                    reject(new Error(
                        "MiniSearch failed to initialise."
                    ));

                }

            };

            script.addEventListener(
                "load",
                checkLoaded,
                { once: true }
            );

            script.addEventListener(
                "error",
                () => reject(new Error(
                    "Unable to download MiniSearch."
                )),
                { once: true }
            );

            if (!existingScript) {

                script.src = MINISEARCH_URL;

                script.async = true;

                document.head.appendChild(script);

            }

        }
    ).catch(error => {

        window.__miniSearchPromise = null;

        throw error;

    });

    return window.__miniSearchPromise;

}


// =======================================================
// 8. INITIALISE SEARCH INDEX
// =======================================================

async function initSearchIndex() {

    try {

        await loadMiniSearch();

        if (
            typeof documents === "undefined" ||
            !Array.isArray(documents)
        ) {

            throw new Error(
                "Article database is missing or invalid."
            );

        }


        // REMOVE INVALID AND DUPLICATE ARTICLES

        const seenHrefs = new Set();

        pagesIndex = documents

            .filter(page =>

                page &&

                typeof page.title === "string" &&

                typeof page.content === "string" &&

                typeof page.href === "string" &&

                page.title.trim() &&

                page.href.trim()

            )

            .map(page => ({

                title: page.title.trim(),

                content: page.content.trim(),

                href: page.href.trim(),

                titleSearch: normaliseSearchText(
                    page.title
                ),

                contentSearch: normaliseSearchText(
                    page.content
                )

            }))

            .filter(page => {

                if (seenHrefs.has(page.href)) {

                    return false;

                }

                seenHrefs.add(page.href);

                return true;

            });


        if (!pagesIndex.length) {

            throw new Error(
                "No valid articles found."
            );

        }


        // ASSIGN UNIQUE ARTICLE IDS

        pageById = new Map();

        pagesIndex = pagesIndex.map((page, index) => {

            const indexedPage = {

                ...page,

                id: String(index)

            };

            pageById.set(
                indexedPage.id,
                indexedPage
            );

            return indexedPage;

        });


        // CREATE MINISEARCH INDEX

        searchIndex = new MiniSearch({

            fields: [

                "titleSearch",

                "contentSearch"

            ],

            storeFields: [

                "title",

                "content",

                "href"

            ],

            idField: "id",

            processTerm: term =>
                normaliseSearchText(term),

            tokenize: text =>

                normaliseSearchText(text)

                    .split(/\s+/)

                    .filter(Boolean)

        });


        // INDEX ALL ARTICLES

        searchIndex.addAll(pagesIndex);


        console.info(
            "MiniSearch initialised:",
            pagesIndex.length,
            "articles."
        );

        hideErrorMessage();

        return true;

    }

    catch (error) {

        console.error(
            "Search initialisation failed:",
            error
        );

        searchIndex = null;

        pagesIndex = [];

        pageById.clear();

        displayErrorMessage(
            "Search could not be loaded. Please refresh the page."
        );

        return false;

    }

}


// =======================================================
// 9. WAIT FOR ARTICLE DATABASE
// =======================================================

function waitForSearchDependencies() {

    let attempts = 0;

    const maxAttempts = 100;

    const check = () => {

        if (
            typeof documents !== "undefined" &&
            Array.isArray(documents)
        ) {

            initSearchIndex();

            return;

        }

        attempts++;

        if (attempts < maxAttempts) {

            setTimeout(check, 100);

        } else {

            console.error(
                "Article database failed to load."
            );

            displayErrorMessage(
                "Search is currently unavailable. Please refresh the page."
            );

        }

    };

    check();

}


// =======================================================
// 10. MINISEARCH QUERY EXECUTION
// =======================================================

function runMiniSearchQuery(

    terms,

    combineWith = "AND",

    fuzzy = false,

    prefix = false

) {

    if (!searchIndex || !terms.length) {

        return [];

    }

    try {

        const options = {

            combineWith,

            boost: {

                titleSearch: 10,

                contentSearch: 1

            }

        };


        // PREFIX MATCHING

        if (prefix) {

            options.prefix = true;

        }


        // FUZZY MATCHING

        if (fuzzy) {

            options.fuzzy = term => {

                if (term.length < MIN_FUZZY_LENGTH) {

                    return false;

                }

                return FUZZY_DISTANCE;

            };

        }


        const hits = searchIndex.search(
            terms.join(" "),
            options
        );


        return hits

            .map(hit => {

                const page = pageById.get(
                    String(hit.id)
                );

                if (!page) {

                    return null;

                }

                return {

                    ...page,

                    score: hit.score

                };

            })

            .filter(Boolean)

            .sort((a, b) => b.score - a.score);

    }

    catch (error) {

        console.warn(
            "MiniSearch query failed:",
            error
        );

        return [];

    }

}


// =======================================================
// 11. MAIN SEARCH ENGINE
// EXACT, NICKNAME, PREFIX AND FUZZY SEARCH
// =======================================================

function searchSite(query) {

    if (!searchIndex) {

        return [];

    }

    const terms = getUniqueSearchTerms(query);

    if (!terms.length) {

        return [];

    }


    const collectedResults = new Map();


    // COLLECT RESULTS WITHOUT DUPLICATES

    function collectResults(results, priority = 1) {

        results.forEach(hit => {

            const adjustedScore =
                hit.score * priority;

            const existing =
                collectedResults.get(hit.id);

            if (
                !existing ||
                adjustedScore > existing.score
            ) {

                collectedResults.set(hit.id, {

                    ...hit,

                    score: adjustedScore

                });

            }

        });

    }


    // FIRST: EXACT SEARCH

    const exactResults = runMiniSearchQuery(
        terms,
        "AND"
    );

    collectResults(exactResults, 1.5);


    // SECOND: NICKNAME AND FULL NAME VARIATIONS

    const variations = getSearchVariations(terms);

    variations.forEach(variation => {

        const isOriginal = variation.every(
            (term, index) => term === terms[index]
        );

        if (isOriginal) {

            return;

        }

        const results = runMiniSearchQuery(
            variation,
            "AND"
        );

        collectResults(results, 1);

    });


    // THIRD: OPTIONAL MATCHING

    if (!collectedResults.size && terms.length > 1) {

        collectResults(

            runMiniSearchQuery(
                terms,
                "OR"
            ),

            1

        );

    }


    // FOURTH: PREFIX MATCHING

    if (!collectedResults.size) {

        const prefixTerms = terms.filter(
            term => term.length >= MIN_PREFIX_LENGTH
        );

        if (prefixTerms.length) {

            collectResults(

                runMiniSearchQuery(
                    prefixTerms,
                    "OR",
                    false,
                    true
                ),

                1

            );

        }

    }


    // FIFTH: FUZZY MATCHING

    if (!collectedResults.size) {

        const fuzzyTerms = terms.filter(
            term => term.length >= MIN_FUZZY_LENGTH
        );

        if (fuzzyTerms.length) {

            collectResults(

                runMiniSearchQuery(
                    fuzzyTerms,
                    "OR",
                    true,
                    false
                ),

                1

            );

        }

    }


    // RETURN RANKED RESULTS

    return [...collectedResults.values()]

        .sort((a, b) => b.score - a.score)

        .slice(0, MAX_RESULTS);

}


// =======================================================
// 12. ERROR MESSAGES
// =======================================================

function displayErrorMessage(message) {

    const errorElement = document.querySelector(
        ".search-wrapper .search-error"
    );

    if (!errorElement) {

        console.warn(message);

        return;

    }

    const messageElement = errorElement.querySelector(
        ".search-error-message"
    );

    if (messageElement) {

        messageElement.textContent = message;

    } else {

        errorElement.textContent = message;

    }

    errorElement.classList.remove("hide-element");

    errorElement.style.display = "block";

}


function hideErrorMessage() {

    const errorElement = document.querySelector(
        ".search-wrapper .search-error"
    );

    if (!errorElement) {

        return;

    }

    errorElement.classList.add("hide-element");

    errorElement.style.display = "none";

}


// =======================================================
// 13. SEARCH EVENT HANDLER
// =======================================================

function handleSearchQuery(event) {

    if (event) {

        event.preventDefault();

    }

    const searchInput = document.getElementById("search");

    if (!searchInput) {

        console.error(
            "Search input #search not found."
        );

        return;

    }

    if (!searchIndex) {

        displayErrorMessage(
            "Search is still loading. Please try again shortly."
        );

        return;

    }

    const query = searchInput.value.trim();

    if (!query) {

        clearSearchResults();

        hideSearchResults();

        displayErrorMessage(
            "Please enter a search term."
        );

        return;

    }

    const results = searchSite(query);

    if (!results.length) {

        clearSearchResults();

        hideSearchResults();

        displayErrorMessage(
            "Your search returned no results."
        );

        return;

    }

    hideErrorMessage();

    renderSearchResults(query, results);

}


// =======================================================
// 14. RENDER SEARCH RESULTS
// NO AUTOMATIC PAGE SCROLLING
// =======================================================

function renderSearchResults(query, results) {

    clearSearchResults();

    updateSearchResults(query, results);

    showSearchResults();

    // No automatic scrolling.
    // No window.scrollTo().
    // No element.scrollIntoView().

}


// =======================================================
// 15. CLEAR SEARCH RESULTS
// =======================================================

function clearSearchResults() {

    const results = document.querySelector(
        ".search-wrapper .search-results ul"
    );

    if (results) {

        results.replaceChildren();

    }

}


// =======================================================
// 16. UPDATE SEARCH RESULTS
// =======================================================

function updateSearchResults(query, results) {

    const resultList = document.querySelector(
        ".search-wrapper .search-results ul"
    );

    if (!resultList) {

        console.error(
            "Search results list not found. Check your HTML."
        );

        return;

    }


    // UPDATE SEARCH QUERY

    const queryElement = document.getElementById("query");

    if (queryElement) {

        queryElement.textContent = query;

    }


    const limitedResults = results.slice(0, MAX_RESULTS);

    const fragment = document.createDocumentFragment();


    limitedResults.forEach(hit => {

        const li = document.createElement("li");

        li.className = "search-result-item";

        li.dataset.score = Number(hit.score).toFixed(2);


        // ARTICLE TITLE

        const link = document.createElement("a");

        link.href = hit.href;

        link.className = "text-primary fs-5 fw-bolder";

        link.textContent = hit.title;

        link.style.color = getColorForSearchResult(
            hit.score
        );

        li.appendChild(link);


        // ARTICLE DESCRIPTION

        const paragraph = document.createElement("p");

        const snippet = createSearchResultBlurb(
            query,
            hit.content
        );

        appendHighlightedText(
            paragraph,
            snippet,
            query
        );

        li.appendChild(paragraph);

        fragment.appendChild(li);

    });


    resultList.appendChild(fragment);


    // RESULTS COUNT

    const count = limitedResults.length;

    const countElement = document.getElementById(
        "results-count"
    );

    const countTextElement = document.getElementById(
        "results-count-text"
    );

    if (countElement) {

        countElement.textContent = count;

    }

    if (countTextElement) {

        countTextElement.textContent =
            count === 1 ? " result" : " results";

    }

}


// =======================================================
// 17. CREATE RELEVANT SEARCH SNIPPETS
// =======================================================

function createSearchResultBlurb(query, pageContent) {

    if (!pageContent) {

        return "";

    }

    const terms = getExpandedSearchTerms(query);

    const sentences = pageContent.match(
        SENTENCE_REGEX
    ) || [];


    if (!sentences.length) {

        return pageContent.slice(
            0,
            MAX_SUMMARY_LENGTH
        );

    }


    // SCORE EACH SENTENCE

    const rankedSentences = sentences.map(
        (sentence, index) => {

            const sentenceTerms = getUniqueSearchTerms(
                sentence
            );

            let score = 0;

            terms.forEach(term => {

                if (
                    sentenceTerms.some(word =>
                        word.startsWith(term) ||
                        term.startsWith(word)
                    )
                ) {

                    score += Math.min(term.length, 12);

                }

            });

            return {

                sentence: sentence.trim(),

                score,

                index

            };

        }
    );


    // SELECT MOST RELEVANT SENTENCES

    const relevantSentences = rankedSentences

        .filter(item => item.score > 0)

        .sort((a, b) =>
            b.score - a.score || a.index - b.index
        )

        .slice(0, MAX_SNIPPET_SENTENCES)

        .sort((a, b) => a.index - b.index);


    if (!relevantSentences.length) {

        return pageContent.slice(
            0,
            MAX_SUMMARY_LENGTH
        );

    }


    // CREATE SNIPPET

    let snippet = relevantSentences

        .map(item => item.sentence)

        .join(" … ");


    if (snippet.length > MAX_SUMMARY_LENGTH) {

        snippet =
            snippet.slice(0, MAX_SUMMARY_LENGTH).trimEnd() + "…";

    }

    return snippet;

}


// =======================================================
// 18. HIGHLIGHT SEARCH TERMS
// =======================================================

function appendHighlightedText(element, text, query) {

    const source = String(text ?? "");

    const terms = getExpandedSearchTerms(query)

        .sort((a, b) => b.length - a.length)

        .map(term => {

            return term

                .split("")

                .map(escapeRegex)

                .join(APOSTROPHE_HIGHLIGHT_REGEX);

        });


    if (!terms.length) {

        element.textContent = source;

        return;

    }


    // MATCH WORDS AND THEIR PREFIXES

    const regex = new RegExp(

        `(^|[^\\p{L}\\p{N}])(${terms.join("|")})[\\p{L}\\p{N}]*`,

        "giu"

    );


    let lastIndex = 0;

    let match;


    while ((match = regex.exec(source)) !== null) {

        const offset = match.index;

        const fullMatch = match[0];

        const precedingCharacter = match[1] || "";

        const highlightedMatch = fullMatch.slice(
            precedingCharacter.length
        );


        // TEXT BEFORE MATCH

        if (offset > lastIndex) {

            element.appendChild(
                document.createTextNode(
                    source.slice(lastIndex, offset)
                )
            );

        }


        // PRESERVE THE PRECEDING CHARACTER

        if (precedingCharacter) {

            element.appendChild(
                document.createTextNode(precedingCharacter)
            );

        }


        // HIGHLIGHT MATCH

        const strong = document.createElement("strong");

        strong.textContent = highlightedMatch;

        element.appendChild(strong);


        lastIndex = offset + fullMatch.length;

    }


    // REMAINING TEXT

    if (lastIndex < source.length) {

        element.appendChild(
            document.createTextNode(
                source.slice(lastIndex)
            )
        );

    }

}


// =======================================================
// 19. ESCAPE REGULAR EXPRESSIONS
// =======================================================

function escapeRegex(value) {

    return value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

}


// =======================================================
// 20. SHOW SEARCH RESULTS
// =======================================================

function showSearchResults() {

    const results = document.querySelector(
        ".search-wrapper .search-results"
    );

    if (results) {

        results.classList.add("is-visible");

        results.classList.remove("hide-element");

    }

    document.getElementById("site-search")
        ?.classList.add("expanded");

    document.getElementById("clear-search-results-modal")
        ?.classList.remove("hide-element");

}


// =======================================================
// 21. HIDE SEARCH RESULTS
// =======================================================

function hideSearchResults() {

    const results = document.querySelector(
        ".search-wrapper .search-results"
    );

    if (results) {

        results.classList.remove("is-visible");

    }

    document.getElementById("clear-search-results-modal")
        ?.classList.add("hide-element");

    document.getElementById("site-search")
        ?.classList.remove("expanded");

}


// =======================================================
// 22. SEARCH RESULT COLOURS
// =======================================================

function getColorForSearchResult(score) {

    return adjustHue(171, 212, score);

}


function adjustHue(hue1, hue2, score) {

    if (score > 3) {

        return `hsl(${hue1}, 100%, 50%)`;

    }

    const hueAdjust =

        (Math.max(0, Number(score) || 0) / 3) *

        (hue1 - hue2);

    const newHue = hue2 + Math.floor(hueAdjust);

    return `hsl(${newHue}, 100%, 50%)`;

}


// =======================================================
// 23. CLEAR SEARCH
// =======================================================

function handleClearSearchButtonClicked(event) {

    if (event) {

        event.preventDefault();

    }

    hideSearchResults();

    clearSearchResults();

    hideErrorMessage();

    const searchInput = document.getElementById("search");

    if (searchInput) {

        searchInput.value = "";

    }

}


// =======================================================
// 24. EVENT LISTENERS
// =======================================================

function initialiseSearchEvents() {

    const searchForm = document.getElementById(
        "search-form-001"
    );

    const searchInput = document.getElementById(
        "search"
    );


    // SEARCH FORM

    if (
        searchForm &&
        !searchForm.dataset.searchInitialised
    ) {

        searchForm.dataset.searchInitialised = "true";

        searchForm.addEventListener(
            "submit",
            handleSearchQuery
        );

    }


    // SEARCH INPUT

    if (
        searchInput &&
        !searchInput.dataset.searchInitialised
    ) {

        searchInput.dataset.searchInitialised = "true";

        searchInput.addEventListener(
            "focus",
            hideErrorMessage
        );

    }


    // SEARCH BUTTON

    const searchButton = document.querySelector(
        ".search-button"
    );

    if (
        searchButton &&
        !searchButton.dataset.searchInitialised
    ) {

        searchButton.dataset.searchInitialised = "true";

        searchButton.addEventListener(
            "click",
            event => {

                // The form submit event handles
                // buttons with submit behaviour.

                if (
                    !searchForm ||
                    searchButton.type !== "submit"
                ) {

                    handleSearchQuery(event);

                }

            }
        );

    }


    // SEARCH ICON

    const searchIcon = document.querySelector(
        ".search-icon"
    );

    if (
        searchIcon &&
        !searchIcon.dataset.searchInitialised
    ) {

        searchIcon.dataset.searchInitialised = "true";

        searchIcon.addEventListener(
            "click",
            handleSearchQuery
        );

    }


    // CLEAR BUTTONS

    document.querySelectorAll(
        ".clear-search-results"
    ).forEach(button => {

        if (button.dataset.searchInitialised) {

            return;

        }

        button.dataset.searchInitialised = "true";

        button.addEventListener(
            "click",
            handleClearSearchButtonClicked
        );

    });


    // POPULAR SEARCH BUTTONS

    document.querySelectorAll(
        ".topic-list button"
    ).forEach(button => {

        if (button.dataset.searchInitialised) {

            return;

        }

        button.dataset.searchInitialised = "true";

        button.addEventListener(
            "click",
            () => {

                const input = document.getElementById("search");

                if (!input) {

                    return;

                }

                input.value =

                    button.dataset.search ||

                    button.textContent.trim();

                handleSearchQuery();

            }
        );

    });

}


// =======================================================
// 25. DOM INITIALISATION
// =======================================================

function initialiseSearch() {

    // Prevent duplicate initialisation.

    if (window.__searchInitialised) {

        return;

    }

    window.__searchInitialised = true;

    initialiseSearchEvents();

    waitForSearchDependencies();

}


// =======================================================
// 26. START SEARCH ENGINE
// =======================================================

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initialiseSearch,
        { once: true }
    );

} else {

    initialiseSearch();

}


// =======================================================
// END OF MINISEARCH ENGINE
// =======================================================
