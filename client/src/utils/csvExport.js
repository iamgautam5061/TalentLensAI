export const exportCandidatesToCSV = (candidates, jobTitle) => {
  if (!candidates || candidates.length === 0) {
    return;
  }

  // Define CSV columns
  const headers = [
    'Rank',
    'Full Name',
    'Email',
    'Match Score (%)',
    'Interview Recommendation',
    'Recommendation',
  ];

  // Build CSV rows
  const rows = candidates.map((candidate) => [
    candidate.rank,
    `${candidate.firstName} ${candidate.lastName}`,
    candidate.email,
    candidate.matchScore,
    candidate.interviewRecommendation,
    // Wrap recommendation in quotes — it may contain commas
    `"${candidate.recommendation?.replace(/"/g, '""') ?? ''}"`,
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  // Create a blob and trigger download
  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${jobTitle.replace(/\s+/g, '_')}_candidates.csv`;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};