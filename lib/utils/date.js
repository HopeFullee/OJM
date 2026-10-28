// ISO 문자열(또는 Date)을 로컬 기준 YYYY-MM-DD로 변환
// 인자를 생략하면 오늘 날짜
export const getFormattedDate = (isoString = new Date()) => {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`올바른 날짜 형식이 아닙니다: ${isoString}`);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
