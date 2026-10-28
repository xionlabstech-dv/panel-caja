// Sin 0/O ni 1/I/l: se puede dictar por teléfono o WhatsApp sin ambigüedad.
const ALFABETO = '23456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';

export function generarPassword(longitud = 16): string {
  // 256 no es múltiplo del tamaño del alfabeto: tomar `byte % alfabeto.length`
  // a secas hace que los primeros caracteres del alfabeto salgan más seguido
  // que los últimos. Se descarta el tramo sobrante y se vuelve a sortear
  // (muestreo por rechazo), en vez de sesgar la distribución.
  const limite = Math.floor(256 / ALFABETO.length) * ALFABETO.length;
  const resultado: string[] = [];
  while (resultado.length < longitud) {
    const lote = new Uint8Array(longitud * 2);
    crypto.getRandomValues(lote);
    for (const byte of lote) {
      if (resultado.length >= longitud) break;
      if (byte >= limite) continue;
      resultado.push(ALFABETO[byte % ALFABETO.length]);
    }
  }
  return resultado.join('');
}
