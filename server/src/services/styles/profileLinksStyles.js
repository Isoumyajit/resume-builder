const profileLinksStyles = `
  .profile-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 6px;
  }

  .profile-links__item {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
    flex-wrap: wrap;
    word-break: break-word;
  }

  .profile-links__label {
    font-weight: semibold;
    color: #rgb(59, 59, 59);
  }

  .profile-links__link {
    text-decoration: underline;
    color: #000;
  }
`;

module.exports = { profileLinksStyles };
