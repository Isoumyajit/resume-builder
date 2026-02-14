export default function Footer() {
  return (
    <div
      data-testid="footer"
      className="footer-container fixed bottom-0 left-0 right-0
         bg-gray-300 dark:bg-gray-900 py-2 px-2 border-t border-gray-300 dark:border-gray-700"
    >
      <div
        data-testid="footer-content"
        className="footer-content flex items-center gap-2"
      >
        <span className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Resume Builder. All rights reserved.
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          <a
            data-testid="github-link"
            href="https://github.com/Isoumyajit"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              width="20"
              height="20"
              src="https://img.icons8.com/3d-fluency/94/github-logo.png"
              alt="github-logo"
            />
          </a>
        </span>
      </div>
    </div>
  );
}
