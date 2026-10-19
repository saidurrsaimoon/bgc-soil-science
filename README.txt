BGC Soil Science redesigned site files

Upload/replace these files in the ROOT of your existing GitHub Pages repository:
- index.html
- style.css
- script.js
- logo.png

Firebase config, login/registration, email verification, student approval, notice moderation, assignments, exams, and profile flow are retained from the supplied original script. The student-approval action name is separated from notice approval to fix the existing admin action collision.

New UI: redesigned editorial botanical hero, animated emblem/rings, responsive stats strip, refreshed theme swatches, polished notice/student cards, improved mobile navigation and dialogs, scroll-friendly layout, reduced-motion support, and device-local saved/bookmarked notices.

Saved notices are stored in the current browser/device only (localStorage), not synced to Firebase.

After uploading, wait for GitHub Pages to deploy. The HTML references style.css?v=4 and script.js?v=4 to encourage browsers to fetch updated assets. A hard refresh may still be needed.
