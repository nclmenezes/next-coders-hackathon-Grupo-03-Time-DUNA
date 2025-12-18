export const getInitialsFromFullName = (fullName: string) => {
  const nameParts = fullName.trim().split(" ");

  if (nameParts.length === 1) {
    return nameParts[0].charAt(0);
  }

  const firstInitial = nameParts[0].charAt(0);
  const lastInitial = nameParts[nameParts.length - 1].charAt(0);

  return firstInitial + lastInitial;
};
