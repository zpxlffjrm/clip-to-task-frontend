export const parseSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  let result = ""

  if (hours > 0) {
    result += `${hours}시간 `
  }
  if (minutes > 0) {
    result += `${minutes}분 `
  }
  if (remainingSeconds > 0) {
    result += `${remainingSeconds}초`
  }

  return result
}
