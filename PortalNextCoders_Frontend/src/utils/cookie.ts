class CookieUtils {
  static setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  static getCookie(name: string): string | null {
    try {
      const cookies = document.cookie.split("; ");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0] === name) {
          // Remover o cookie
          this.deleteCookie(name);
          return cookie[1];
        }
      }
      return null;
    } catch (error) {
      console.error("Erro ao obter cookie:", error);
      return null;
    }
  }

  static deleteCookie(name: string) {
    try {
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (error) {
      console.error("Erro ao excluir cookie:", error);
    }
  }
}

export default CookieUtils;
