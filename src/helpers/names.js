const nameWithInitials = (second, first, father) => {
  if (!first || !second) {
    return ''
  }
  let result = second
          + ' ' + first.charAt(0) + '.';
  if (father) {
      result += father.charAt(0) + '.';
  }
  return result;
}

const fullName = (second, first, father) => {
  return (
    [second, first, father].filter(Boolean).join(' ')
  )
}

export {
  nameWithInitials,
  fullName
}