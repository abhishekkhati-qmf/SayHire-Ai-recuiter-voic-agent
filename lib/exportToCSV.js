import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const exportToCSV = (candidates) => {
    console.log(candidates);
    if (!candidates || candidates.length === 0) {
    alert("No candidates to export");
    return;
  }
  const data = candidates.map(c => ({
    Name: c.fullName,
    Email: c.email,
    TechnicalSkills:c.conversation_transcript?.feedback?.rating?.TechnicalSkills || 0,
    Communication: c.conversation_transcript?.feedback?.rating?.Communication || 0,
    ProblemSolving:c.conversation_transcript?.feedback?.rating?.ProblemSolving || 0,
    Experience: c.conversation_transcript?.feedback?.rating?.Experience || 0,
    Behavioral: c.conversation_transcript?.feedback?.rating?.Behavioral || 0,
    Analysis:c.conversation_transcript?.feedback?.rating?.Analysis || 0,
    Recommendation: c.conversation_transcript?.feedback?.Recommendation || '',
    RecommendationMessage: c.conversation_transcript?.feedback?.RecommendationMessage || '',
    Summary: c.conversation_transcript?.feedback?.summary || '',
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "candidates.csv");
};

export default exportToCSV;