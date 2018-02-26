(($) => {

  const icons = {
    copy: chrome.extension.getURL('icon-copy.svg'),
  };

  // initialization
  addCopyIconToIssueCards();
  addCopyIconToOpenedIssue();

  function addCopyIconToOpenedIssue() {
    const idRegEx = /^\/issues\/(\d+)$/;
    const match = location.pathname.match(idRegEx);
    if (!match) { return }

    const [ , id ] = match;
    const name = $('.issue h3').text();
    const textToCopy = `${id} ${name}`;

    const copyIcon$ = makeIcon(textToCopy);


    $('h2').prepend(copyIcon$);
  }

  function addCopyIconToIssueCards() {
    $('.issue-card').each((i, el) => {
      const id         = $(el).find('.issue-id strong').text().replace(/^\w+ #/, '');
      const name       = $(el).find('.name a').text();
      const textToCopy = `${id} ${name}`;

      const copyIcon$ = makeIcon(textToCopy);

      $(el).find('.info').prepend(copyIcon$);
    });
  }

  function makeIcon(textToCopy) {
    const copyIcon$ = $('<img>');

    copyIcon$
      .attr('src', icons.copy)
      .attr('title', 'Click to copy task number and description')
      .addClass('gravatar')
      .addClass('redmine-helper-icon')
      .click(() => {
        copyTask(textToCopy);
        copyIcon$.addClass('active');
        setTimeout(() => copyIcon$.removeClass('active'), 400);
      });

    return copyIcon$;
  }

  function copyTask(text) {
    setClipboardText(text);
  }

  function setClipboardText(text) {
    var id             = 'mycustom-clipboard-textarea-hidden-id';
    var existsTextarea = document.getElementById(id);

    if (!existsTextarea) {
      // console.log('Creating textarea');
      var textarea            = document.createElement('textarea');
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
      var status = document.execCommand('copy');
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
