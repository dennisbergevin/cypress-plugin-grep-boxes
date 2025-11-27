/**
 * Adds a toggle to reporter to grep selected tests.
 */

const tests = [];

const hasStyles = window.top?.document.querySelector('#grepTestToggleStyle');
const hasToggleButton = window.top?.document.querySelector('#grepTestToggle');
const defaultStyles = `
        .reporter header {
          overflow: visible;
          z-index: 2;
        }
        #grepTestToggleControls {
          position: relative;
          display: inline-block;
        }
        #grepTestToggle {
          display: none;
        }
        #grepTestToggleControls label {
          background-color: transparent;
          padding-top: 5px;
          padding-right: 2px;
        }
        #grepTestToggleControls #grepTestToggleTooltip {
          visibility: hidden;
          width: 150px;
          background-color: #f3f4fa;
          color: #1b1e2e;
          text-align: center;
          padding: 5px;
          border-radius: 3px;
          position: absolute;
          z-index: 99999;
          top: 33px;
          right: -2px;
          height: 28px;
          overflow: visible;
        }
        #grepTestToggleControls:hover #grepTestToggleTooltip {
          visibility: visible;
          z-index: 99999;
          overflow: visible;
        }
        #grepTestToggleButton #grepTestToggleLabel {
          cursor: pointer;
        }
        #grepTestToggleTooltip::after {
          content: " ";
          position: absolute;
          bottom: 100%;  /* At the top of the tooltip */
          left: 89%;
          z-index: 99999;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          overflow: visible;
          border-color: transparent transparent #f3f4fa transparent;
        }
        .reporter:has(#grepTestToggle:checked) .command.command-name-request:has(.command-is-event) {
          display:none
        }
        .spec-container {
          overflow: visible !important
        }
        `;
const turnOngrepTestToggleIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#afb3c7" class="bi bi-collection-play-fill" viewBox="0 0 16 16">
  <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zm6.258-6.437a.5.5 0 0 1 .507.013l4 2.5a.5.5 0 0 1 0 .848l-4 2.5A.5.5 0 0 1 6 12V7a.5.5 0 0 1 .258-.437"/>
</svg>`;

const turnOffgrepTestToggleIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#afb3c7" class="bi bi-collection-play" viewBox="0 0 16 16">
  <path d="M2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3m2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1m2.765 5.576A.5.5 0 0 0 6 7v5a.5.5 0 0 0 .765.424l4-2.5a.5.5 0 0 0 0-.848z"/>
  <path d="M1.5 14.5A1.5 1.5 0 0 1 0 13V6a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 16 6v7a1.5 1.5 0 0 1-1.5 1.5zm13-1a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5h-13A.5.5 0 0 0 1 6v7a.5.5 0 0 0 .5.5z"/>
</svg>`;

const turnOffgrepTestToggleDescription = 'Filter selected tests';
const turnOngrepTestToggleDescription = 'Unfilter selected tests';

// append styles
if (!hasStyles) {
  let reporterEl;
  const reporterStyleEl = document.createElement('style');
  if (Cypress.version >= '15.0.0') {
    reporterEl = window.top?.document.querySelector('.runnable-header');
  } else {
    reporterEl = window.top?.document.querySelector('#unified-reporter');
  }
  reporterStyleEl.setAttribute('id', 'grepTestToggleStyle');
  reporterStyleEl.innerHTML = defaultStyles;
  reporterEl?.appendChild(reporterStyleEl);
}

if (!hasToggleButton) {
  let header;
  if (Cypress.version >= '15.0.0') {
    // TODO: Cypress v15 GUI provides option for Cypress Studio which pushes the grep toggle button around the UI
    // For simplicity, moving the toggle button to the spec container above the stop button
    header = window.top?.document.querySelector('.runnable-header');
  } else {
    header = window.top?.document.querySelector('#unified-reporter header');
  }
  const headerToggleDiv = document.createElement('div');
  const headerToggleSpan = document.createElement('span');
  const headerToggleTooltip = document.createElement('span');
  const headerToggleButton = document.createElement('button');
  const headerToggleInput = document.createElement('input');
  const headerToggleLabel = document.createElement('label');

  headerToggleInput.setAttribute('type', 'checkbox');

  headerToggleInput.setAttribute('id', 'grepTestToggle');
  headerToggleLabel.setAttribute('for', 'grepTestToggle');
  headerToggleLabel.setAttribute('id', 'grepTestToggleLabel');
  headerToggleLabel.innerHTML = turnOffgrepTestToggleIcon;

  headerToggleDiv.setAttribute('id', 'grepTestToggleControls');
  headerToggleTooltip.setAttribute('id', 'grepTestToggleTooltip');
  headerToggleTooltip.innerText = turnOffgrepTestToggleDescription;
  headerToggleButton.setAttribute(
    'aria-label',
    turnOffgrepTestToggleDescription
  );
  headerToggleButton.setAttribute('id', 'grepTestToggleButton');

  headerToggleDiv.setAttribute('class', 'controls');
  header?.appendChild(headerToggleDiv);
  headerToggleDiv?.appendChild(headerToggleSpan);
  headerToggleDiv?.appendChild(headerToggleTooltip);
  headerToggleSpan?.appendChild(headerToggleButton);
  headerToggleButton?.appendChild(headerToggleInput);
  headerToggleButton?.appendChild(headerToggleLabel);
}

const grepTestToggleElement =
  window.top?.document.querySelector('#grepTestToggle');
const grepTestToggleLabelElement = window.top?.document.querySelector(
  '[for=grepTestToggle]'
);
const grepTestToggleTooltipElement = window.top?.document.querySelector(
  '#grepTestToggleTooltip'
);

grepTestToggleElement?.addEventListener('change', (e) => {
  const stopBtn = window.top?.document.querySelector('.reporter .stop');

  if (e.target.checked) {
    if (stopBtn) {
      stopBtn.click();
    }
    // store all checked checkbox values then send to grep in accepted format
    const tests = [
      ...window.top?.document.querySelectorAll('.grep-test-checkbox:checked'),
    ].map((e) => e.value);
    // store all non-checked checkbox values
    const uncheckedTests = [
      ...window.top?.document.querySelectorAll(
        '.grep-test-checkbox:not(:checked)'
      ),
    ].map((e) => e.value);

    tests.forEach((t) => {
      // if a checked test title begins with the grep inverted '-' symbol, remove the '-'
      if (t[0] === '-') {
        tests.push(t.slice(1));
        tests.splice(
          tests.findIndex((e) => e === t),
          1
        );
      }

      // if a non-checked test's title includes a checked test's title, invert grep for unchecked title
      uncheckedTests.forEach((u) => {
        if (u.includes(t)) {
          tests.push(`-${u}`);
        }
      });
    });

    // run all tests displayed in the spec if none are checked
    // this enables cohesion with this plugin and cypress-plugin-filter-runnables
    // the display: none is used to hide runnables not matching a filter
    if (tests.length === 0) {
      const checkboxes = [
        ...window.top?.document.querySelectorAll('.grep-test-checkbox'),
      ].filter((box) => {
        const runnable = box.closest('.runnable');
        return runnable && window.getComputedStyle(runnable).display !== 'none';
      });

      checkboxes.forEach((box) => tests.push(box.value));
    }

    Cypress.grep(tests.join(';'));

    // when checked, grep only selected tests in spec
    grepTestToggleLabelElement.innerHTML = turnOngrepTestToggleIcon;
    grepTestToggleTooltipElement.innerHTML = turnOngrepTestToggleDescription;
  } else {
    // for cypress-plugin-filter-runnables to clear search when grepTestToggle is unchecked
    const searchInput = window.top?.document.querySelector(
      '#test-suite-filter-search'
    );
    const clearBtn = window.top?.document.querySelector(
      '#clear-test-suite-filter-search'
    );
    if (searchInput != '') {
      clearBtn?.click();
    }

    if (stopBtn) {
      stopBtn.click();
    }
    // when unchecked, ungrep and show all tests in spec
    Cypress.grep();
    grepTestToggleLabelElement.innerHTML = turnOffgrepTestToggleIcon;
    grepTestToggleTooltipElement.innerHTML = turnOffgrepTestToggleDescription;
  }
});

// Wrapping logic within isInteractive check
// This targets cypress open mode where user can switch specs
if (Cypress.config('isInteractive')) {
  Cypress.on('window:unload', () => {
    addTags();
    // Store the current Cypress test runner url
    // This is to check against any spec change in test runner while the grep filter is activated
    // If a user does switch spec while filter is active, the filter will be reset
    const sidebarSpecLinkPage = window.top?.document.querySelector(
      '[data-cy="sidebar-link-specs-page"]'
    );
    const grepTestToggleElement =
      window.top?.document.querySelector('#grepTestToggle');

    if (
      window.top?.document.URL !=
        sidebarSpecLinkPage.getAttribute('data-url') &&
      grepTestToggleElement.checked
    ) {
      grepTestToggleElement.click();
    }

    sidebarSpecLinkPage.setAttribute('data-url', window.top?.document.URL);
  });
}

if (Cypress.config('isInteractive')) {
  if (
    // if the grep test toggle is not checked, do not run tests
    Cypress.env('disableInitialAutoRun') &&
    window.top?.document.querySelectorAll('#grepTestToggle:checked').length ===
      0
  ) {
    const sidebarSpecLinkPage = window.top?.document.querySelector(
      '[data-cy="sidebar-link-specs-page"]'
    );

    sidebarSpecLinkPage.setAttribute('data-url', window.top?.document.URL);
    Cypress.runner.stop();
  }
}

/**
 * Adds a checkbox for each suite and test for run selection.
 */

const addGrepButtons = () => {
  const hasStyles = window.top?.document.querySelector('#grepButtonsStyle');

  const grepTestsBtnClass = 'grep-tests-btn';

  const defaultStyles = `
  .grep-tests-btn {
    pointer-events: auto;
    background: none;
    color: inherit;
    padding: 0 20px;
    verticalAlign: baseline;
  }

  .grep-test-checkbox {
    appearance: inherit;
    cursor: pointer;
  }
  `;

  if (!hasStyles) {
    const runnablesEl = window.top?.document.querySelector('.runnables');
    const runnablesStyleEl = window.top?.document.createElement('style');
    runnablesStyleEl.setAttribute('id', 'grepButtonsStyle');
    runnablesStyleEl.innerHTML = defaultStyles;
    runnablesEl?.appendChild(runnablesStyleEl);
  }
  let testsAndSuites;
  if (Cypress.version >= '15.0.0') {
    // TODO: Cypress v15 implemented a new suite naming convention that utilizes " > " separator between nested suites
    // For now, only allowing tests to be selected for simplicity
    testsAndSuites = window.top?.document.querySelectorAll('.test.runnable');
  } else {
    testsAndSuites = window.top?.document.querySelectorAll(
      '.test.runnable, .suite.runnable'
    );
  }
  [...testsAndSuites].forEach((t) => {
    const header = t.querySelector('.collapsible-header');
    const title = header.querySelector('.runnable-title');
    const testName = title.innerText.split('\n')[0];

    // Don't add the button if it already exists
    if (header.querySelectorAll(`.${grepTestsBtnClass}`).length) {
      return;
    }

    const grepTestsBtn = window.top?.document.createElement('button');
    grepTestsBtn.className = grepTestsBtnClass;
    grepTestsBtn.style.background = 'none';
    grepTestsBtn.style.color = 'inherit';
    grepTestsBtn.style.padding = '0 20px';
    grepTestsBtn.style.verticalAlign = 'baseline';
    grepTestsBtn.setAttribute(
      'aria-label',
      'Checkbox to select suite/test for filtering'
    );

    // Add checkbox
    const checkbox = window.top?.document.createElement('input');
    checkbox.className = 'grep-test-checkbox';
    checkbox.type = 'checkbox';
    checkbox.value = testName;
    if (tests.includes(checkbox.value)) {
      checkbox.checked = true;
    }

    grepTestsBtn.appendChild(checkbox);
    header.appendChild(grepTestsBtn);

    // Push checked tests to an array for temporary storage
    // This is for when a suite collapses in UI and removes a given test runnable
    // When the collapsible expands, any previously checked test will remain checked
    checkbox?.addEventListener('change', (e) => {
      if (e.target.checked) {
        tests.push(checkbox.value);
      } else {
        tests.splice(
          tests.findIndex((e) => e === checkbox.value),
          1
        );
      }
    });

    // To prevent a checkbox from expanding a runnable, click the collapsible
    grepTestsBtn?.addEventListener('change', (e) => {
      if (e.target.checked || e.target.unchecked) {
        header.click();
      }
    });
  });
};

/**
 * Adds a clickable test tag for each respective test in Cypress open mode.
 */

export const addTags = () => {
  const defaultStyles = `
[data-attribute="test-tags"]:focus {
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.9);;
    outline: none;
}
`;
  if (Cypress.env('specTags')) {
    const hasStyles = window.top?.document.querySelector('#tagPillStyle');

    if (!hasStyles) {
      const runnablesStyleEl = window.top?.document.createElement('style');
      const runnables = window.top?.document.querySelector('.runnables');
      runnablesStyleEl.setAttribute('id', 'tagPillStyle');
      runnablesStyleEl.innerHTML = defaultStyles;
      runnables?.appendChild(runnablesStyleEl);
    }

    const testsAndSuites =
      window.top?.document.querySelectorAll('.test.runnable');
    [...testsAndSuites].forEach((t) => {
      const header = t.querySelector('.collapsible-header');
      const collapsibleHeaderText = header?.querySelector(
        '.collapsible-header-text'
      );
      if (!collapsibleHeaderText.className.includes('flex flex-wrap gap-2')) {
        collapsibleHeaderText.className += ' flex flex-wrap gap-2';
      }
      const title = header.querySelector('.runnable-title');
      const testName = title.innerText.split('\n')[0];
      const allSpecTags = Cypress.env('specTags');
      const testTag = getTagsForTitle(testName, allSpecTags);
      if (t.querySelectorAll('[data-attribute="test-tags"]').length === 0) {
        renderTagPills(testTag, title);
      }
    });
  }
};

function getTagsForTitle(title, fullTagsObj) {
  const test = fullTagsObj[title];
  if (!test) {
    return []; // Title not found
  }

  const allTags = [...test.effectiveTestTags, ...test.requiredTestTags];
  const tagsToExclude = Cypress.env('hideSpecTags');

  if (!tagsToExclude?.length) return allTags;

  // Filter out excluded tags
  return allTags.filter((tag) => !tagsToExclude?.includes(tag));
}

function renderTagPills(tags, container) {
  tags.forEach((tag) => {
    const pill = document.createElement('button');
    pill.textContent = tag;
    pill.setAttribute('type', 'button');
    pill.setAttribute('aria-label', 'Filter by test tag from grep plugin');
    pill.setAttribute('data-attribute', 'test-tags');

    const brightColors = [
      '#FF7373', // Red
      '#FFB673', // Orange
      '#FFE673', // Yellow
      '#CFFF73', // Lime
      '#73FF78', // Light Green
      '#73FFC6', // Aqua
      '#73E6FF', // Sky Blue
      '#73A6FF', // Blue
      '#7373FF', // Indigo
      '#B473FF', // Purple
      '#E673FF', // Magenta
      '#FF73B6', // Rose
      '#FF6E6E', // Slightly different Red
      '#FFAB73', // Peach
      '#FFF473', // Pale Yellow
      '#DFFF73', // Pale Lime
      '#73FFB6', // Mint
      '#73DFFF', // Light Blue
      '#A673FF', // Lavender
    ];

    function tagNameToColor(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++)
        hash = str.charCodeAt(i) + ((hash << 7) - hash);
      return Math.abs(hash % 6);
    }

    function getTagColor(tag) {
      const hash = tagNameToColor(tag);
      return brightColors[hash % brightColors.length];
    }

    const bgColor = getTagColor(tag);

    pill.setAttribute(
      'style',
      `
    background: ${bgColor};
    color: black;
    padding: 0.1rem 0.2rem;
    font-size: 0.875rem;
    font-weight: bold;
    border-radius: 2px;
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    cursor: pointer;
    pointer-events: auto;
  `
    );

    // Base styles
    pill.className = `px-1 text-sm block inline-flex items-center whitespace-nowrap rounded`;

    if (
      // if the grep test toggle is checked, do not show checkboxes on each runnable
      window.top?.document.querySelectorAll('#grepTestToggle:checked')
        .length === 0
    ) {
      // Handle selection toggle
      pill.addEventListener('click', () => {
        window.top?.document.querySelector('#grepTestToggle').click();
        Cypress.grep(undefined, tag);
      });
    }

    container.after(pill);
  });
}

Cypress.on('test:before:run', () => {
  if (
    // if the grep test toggle is checked, do not show checkboxes on each runnable
    window.top?.document.querySelectorAll('#grepTestToggle:checked').length ===
    0
  ) {
    addGrepButtons();
  }
});

// To account for when the collapsible runnables are removed, add back tags and grep buttons
// watching for changes to DOM structure
MutationObserver = window.MutationObserver;

var observer = new MutationObserver(function () {
  if (
    // if the grep test toggle is checked, do not show checkboxes on each runnable
    window.top?.document.querySelectorAll('#grepTestToggle:checked').length ===
    0
  ) {
    // fired when a mutation occurs
    addGrepButtons();
  }
  addTags();
});

// defining the window.top?.document to be observed by the observer
observer.observe(window.top?.document, {
  subtree: true,
  attributes: true,
});
