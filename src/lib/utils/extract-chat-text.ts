import JSZip from 'jszip';

/**
 * Extracts raw WhatsApp chat text from an uploaded File (.txt or .zip)
 */
export async function extractRawTextFromUpload(file: File): Promise<string> {
  const isZip = file.name.toLowerCase().endsWith('.zip') || file.type.includes('zip');

  if (!isZip) {
    return file.text();
  }

  const buffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);

  let txtInZip = zip.file('_chat.txt');
  if (!txtInZip) {
    const txtFiles = zip.file(/\.txt$/i);
    if (txtFiles && txtFiles.length > 0) {
      txtInZip = txtFiles[0];
    }
  }

  if (!txtInZip) {
    throw new Error('ZIP arşivi içinde WhatsApp sohbet metin dosyası (_chat.txt) bulunamadı.');
  }

  return txtInZip.async('string');
}
