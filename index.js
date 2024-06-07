/**
 * Adds a toggle to reporter to grep selected tests.
 */

const tests = [];

const greppedTestToggle = () => {
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
          z-index: 1;
          top: 27px;
          left: 0px;
          height: 28px;
        }
        #grepTestToggleControls:hover #grepTestToggleTooltip {
          visibility: visible;
        }
        #grepTestToggleButton #grepTestToggleLabel {
          cursor: pointer;
        }
        #grepTestToggleTooltip::after {
          content: " ";
          position: absolute;
          bottom: 100%;  /* At the top of the tooltip */
          right: 85%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent #f3f4fa transparent;
        }
        .reporter:has(#grepTestToggle:checked) .command.command-name-request:has(.command-is-event) {
          display:none
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
    const reporterEl = window.top?.document.querySelector('#unified-reporter');
    const reporterStyleEl = document.createElement('style');
    reporterStyleEl.setAttribute('id', 'grepTestToggleStyle');
    reporterStyleEl.innerHTML = defaultStyles;
    reporterEl?.appendChild(reporterStyleEl);
  }

  if (!hasToggleButton) {
    const header = window.top?.document.querySelector(
      '#unified-reporter header'
    );
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

    headerToggleDiv.setAttribute('class', 'controls');
    headerToggleDiv.setAttribute('id', 'grepTestToggleControls');
    headerToggleTooltip.setAttribute('id', 'grepTestToggleTooltip');
    headerToggleTooltip.innerText = turnOffgrepTestToggleDescription;
    headerToggleButton.setAttribute(
      'aria-label',
      turnOffgrepTestToggleDescription
    );
    headerToggleButton.setAttribute('id', 'grepTestToggleButton');

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
      const uncheckedTests = [
        ...window.top?.document.querySelectorAll(
          '.grep-test-checkbox:not(:checked)'
        ),
      ].map((e) => e.value);

      // if a non-checked test's title includes a checked test's title, invert grep for unchecked title
      tests.forEach((t) => {
        uncheckedTests.forEach((u) => {
          if (u.includes(t)) {
            tests.push(`-${u}`);
          }
        });
      });

      Cypress.grep(tests.join(';'));

      // when checked, grep only selected tests in spec
      grepTestToggleLabelElement.innerHTML = turnOngrepTestToggleIcon;
      grepTestToggleTooltipElement.innerHTML = turnOngrepTestToggleDescription;
    } else {
      if (stopBtn) {
        stopBtn.click();
      }
      // when unchecked, ungrep and show all tests in spec
      Cypress.grep();
      grepTestToggleLabelElement.innerHTML = turnOffgrepTestToggleIcon;
      grepTestToggleTooltipElement.innerHTML = turnOffgrepTestToggleDescription;
    }
  });
};

/**
 * Adds a checkbox for each suite and test for run selection.
 */

const addGrepButtons = () => {
  const hasStyles = window.top?.document.querySelector('#grepButtonsStyle');

  const grepTestsBtnClass = 'grep-tests-btn';

  const defaultStyles = `
  .grep-tests-btn {
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
  const testsAndSuites = window.top?.document.querySelectorAll(
    '.test.runnable, .suite.runnable'
  );
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
      if (e.target.checked) {
        header.click();
      }
    });
  });
};

Cypress.on('test:before:run', () => {
  if (
    // if the grep test toggle is checked, do not show checkboxes on each runnable
    window.top?.document.querySelectorAll('#grepTestToggle:checked').length ===
    0
  ) {
    addGrepButtons();
  }
});

// To account for when the collapsible runnables are removed, add back grep buttons
if (
  // if the grep test toggle is checked, do not show checkboxes on each runnable
  window.top?.document.querySelectorAll('#grepTestToggle:checked').length === 0
) {
  window.top?.document.addEventListener('click', () => {
    addGrepButtons();
  });
  window.top?.document.addEventListener('keypress', () => {
    addGrepButtons();
  });
}

module.exports = { greppedTestToggle, addGrepButtons };
