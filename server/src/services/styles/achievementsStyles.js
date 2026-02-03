const achievementsStyles = `
  .achievements-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .achievement-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.5;
  }

  .achievement-item img {
    margin-top: 6px;
    flex-shrink: 0;
  }

  .achievement-item span {
    flex: 1;
  }
`;

module.exports = { achievementsStyles };
