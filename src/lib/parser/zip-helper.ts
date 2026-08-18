import JSZip from 'jszip';

export interface ExtractedChatFile {
  file: File;
  inferredTitle?: string;
  originalFileName: string;
}

/**
 * Extracts a WhatsApp .txt chat file from either a raw .txt or a .zip archive (standard iOS/Android export)
 */
export async function processUploadedChatFile(rawFile: File): Promise<ExtractedChatFile> {
  const fileNameLower = rawFile.name.toLowerCase();

  // If it's already a .txt file, return directly
  if (fileNameLower.endsWith('.txt')) {
    let inferredTitle: string | undefined;
    const titleMatch = rawFile.name.match(/WhatsApp (?:Chat|Sohbeti) - (.*?)\.txt$/i);
    if (titleMatch && titleMatch[1]) {
      inferredTitle = titleMatch[1].trim();
    }
    return {
      file: rawFile,
      inferredTitle,
      originalFileName: rawFile.name,
    };
  }

  // If it's a .zip file (Standard Apple iOS export)
  if (
    fileNameLower.endsWith('.zip') ||
    rawFile.type === 'application/zip' ||
    rawFile.type === 'application/x-zip-compressed' ||
    rawFile.type === 'multipart/x-zip'
  ) {
    try {
      const zip = await JSZip.loadAsync(rawFile);

      // Look for _chat.txt (iOS standard) or any .txt file
      let textFileInZip: JSZip.JSZipObject | null = null;

      // Priority 1: _chat.txt
      textFileInZip = zip.file('_chat.txt');

      // Priority 2: Any .txt file inside the archive
      if (!textFileInZip) {
        const txtFiles = zip.file(/\.txt$/i);
        if (txtFiles && txtFiles.length > 0) {
          textFileInZip = txtFiles[0];
        }
      }

      if (!textFileInZip) {
        throw new Error('Seçilen ZIP arşivi içinde WhatsApp sohbet metin dosyası (_chat.txt) bulunamadı.');
      }

      const textContent = await textFileInZip.async('string');
      if (!textContent || textContent.trim().length === 0) {
        throw new Error('ZIP içindeki sohbet dosyası boş.');
      }

      // Infer title from zip filename: "WhatsApp Chat - Hafta Sonu.zip" -> "Hafta Sonu"
      let inferredTitle: string | undefined;
      const titleMatch = rawFile.name.match(/WhatsApp (?:Chat|Sohbeti) - (.*?)\.zip$/i);
      if (titleMatch && titleMatch[1]) {
        inferredTitle = titleMatch[1].trim();
      } else {
        inferredTitle = rawFile.name.replace(/\.zip$/i, '').trim();
      }

      // Create a new File object containing the unzipped text
      const extractedTxtFile = new File([textContent], `${inferredTitle || 'chat'}.txt`, {
        type: 'text/plain',
      });

      return {
        file: extractedTxtFile,
        inferredTitle,
        originalFileName: rawFile.name,
      };
    } catch (err: any) {
      throw new Error(err.message || 'ZIP arşivi açılırken bir hata oluştu.');
    }
  }

  throw new Error('Desteklenmeyen dosya formatı. Lütfen WhatsApp .txt veya .zip dosyası seçin.');
}
