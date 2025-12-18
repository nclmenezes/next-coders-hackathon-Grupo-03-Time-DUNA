class Base64 {
  static decode(encodedString: string): string {
    try {
      return atob(encodedString);
    } catch (error) {
      console.error("Error decoding Base64 string:", error);
      return "";
    }
  }

  static encode(stringToEncode: string): string {
    try {
      return btoa(stringToEncode);
    } catch (error) {
      console.error("Error encoding string to Base64:", error);
      return "";
    }
  }
}

export default Base64;