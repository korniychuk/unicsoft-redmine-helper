(($) => {

  const icons = {
    copy: chrome.extension.getURL('icon-copy.svg'),
    link: chrome.extension.getURL('icon-link.svg'),
  };

  // initialization
  addCopyIconsToIssueCards();
  addCopyIconsToOpenedIssue();

  function addCopyIconsToOpenedIssue() {
    const idRegEx = /^\/issues\/(\d+)$/;
    const match = location.pathname.match(idRegEx);
    if (!match) { return }

    const [ , id ] = match;
    const name = $('.issue h3').text();

    const bar$ = makeActionBar(id, name);

    $('h2').prepend(bar$);
  }

  function addCopyIconsToIssueCards() {
    $('.issue-card').each((i, el) => {
      const id   = $(el).find('.issue-id strong').text().replace(/^\w+ #/, '');
      const name = $(el).find('.name a').text();

      const bar$ = makeActionBar(id, name);

      $(el)
        .addClass('redmine-helper--issue-card')
        .prepend(bar$);
    });
  }

  function makeActionBar(taskId, taskName) {
    const icons$ = makeCopyIconsSet(taskId, taskName);

    const bar$ = $(`<div class="redmine-helper--action-bar"><span></span></div>`);
    bar$.find('span')
        .prepend(icons$.id)
        .prepend(icons$.link)
    ;

    return bar$;
  }

  /**
   * @param {string} taskId
   * @param {string} taskName
   */
  function makeCopyIconsSet(taskId, taskName) {
    const nameAndIdToCopy = `${taskId} ${taskName}`;
    const linkToCopy = `${nameAndIdToCopy}\nhttps://uti.unicsoft.com.ua/issues/${taskId}`;

    const id$ = makeCopyIcon(nameAndIdToCopy, icons.copy, 'Click to copy task number and title');
    const link$ = makeCopyIcon(linkToCopy, icons.link, 'Click to copy task URL, number and title');

    return { id: id$, link: link$ };
  }

  /**
   * @param {string} textToCopy
   * @param {string} iconUrl
   * @param {string} tooltip
   */
  function makeCopyIcon(textToCopy, iconUrl, tooltip = '') {
    return makeIcon(iconUrl, () => copyTask(textToCopy), tooltip);
  }

  /**
   * @param {string}   iconUrl
   * @param {Function} callback
   * @param {string}   tooltip
   */
  function makeIcon(iconUrl, callback, tooltip) {
    const btn$ = $('<span class="redmine-helper--icon-button"><img class="gravatar redmine-helper--icon"></span>');
    const copyIcon$ = btn$.find('img');

    copyIcon$
      .attr('src', iconUrl)
      .attr('title', tooltip)
    ;

    btn$.click(() => {
      if (callback instanceof Function) {
        callback();
      }
      btn$.addClass('active');
      setTimeout(() => btn$.removeClass('active'), 400);
    });

    return btn$;
  }

  function copyTask(text) {
    setClipboardText(text);
  }

  function setClipboardText(text) {
    const id           = 'mycustom-clipboard-textarea-hidden-id';
    let existsTextarea = document.getElementById(id);

    if (!existsTextarea) {
      // console.log('Creating textarea');
      const textarea          = document.createElement('textarea');
      textarea.id             = id;
      // Place in top-left corner of screen regardless of scroll position.
      textarea.style.position = 'fixed';
      textarea.style.top      = 0;
      textarea.style.left     = 0;

      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textarea.style.width  = '1px';
      textarea.style.height = '1px';

      // We don't need padding, reducing the size if it does flash render.
      textarea.style.padding = 0;

      // Clean up any borders.
      textarea.style.border    = 'none';
      textarea.style.outline   = 'none';
      textarea.style.boxShadow = 'none';

      // Avoid flash of white box if rendered for any reason.
      textarea.style.background = 'transparent';
      document.querySelector('body').appendChild(textarea);
      // console.log('The textarea now exists :)');
      existsTextarea = document.getElementById(id);
    } else {
      // console.log('The textarea already exists :3')
    }

    existsTextarea.value = text;
    existsTextarea.select();

    try {
      let status = document.execCommand('copy');
      if (!status) {
        console.error('Cannot copy text');
      } else {
        // console.log('The text is now on the clipboard');
      }
    } catch (err) {
      console.log('Unable to copy.');
    }
  }

})(jQuery);
