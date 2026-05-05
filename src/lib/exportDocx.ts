export type DocxSection = {
  heading: string;
  body: string | string[];
};

export type DocxDocument = {
  title: string;
  subtitle: string;
  sections: DocxSection[];
};

export async function downloadDocx(document: DocxDocument, filename: string) {
  const blob = await createDocxBlob(document);
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");

  link.href = url;
  link.download = filename;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function createDocxBlob(document: DocxDocument) {
  const files: ZipFile[] = [
    {
      path: "[Content_Types].xml",
      content: xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`),
    },
    {
      path: "_rels/.rels",
      content: xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`),
    },
    {
      path: "word/document.xml",
      content: xml(buildDocumentXml(document)),
    },
  ];

  return new Blob([createZip(files)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

function buildDocumentXml(document: DocxDocument) {
  const body = [
    paragraph(document.title, "title"),
    paragraph(document.subtitle, "subtitle"),
    ...document.sections.flatMap((section) => [
      paragraph(section.heading, "heading"),
      ...(Array.isArray(section.body)
        ? section.body.map((item) => paragraph(item, "bullet"))
        : [paragraph(section.body, "normal")]),
    ]),
  ].join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${body}
    <w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr>
  </w:body>
</w:document>`;
}

function paragraph(text: string, kind: "title" | "subtitle" | "heading" | "bullet" | "normal") {
  const size = kind === "title" ? "32" : kind === "heading" ? "24" : "20";
  const bold = kind === "title" || kind === "heading" ? "<w:b/>" : "";
  const italic = kind === "subtitle" ? "<w:i/>" : "";
  const bullet = kind === "bullet" ? "• " : "";

  return `<w:p><w:r><w:rPr>${bold}${italic}<w:sz w:val="${size}"/></w:rPr><w:t xml:space="preserve">${escapeXml(`${bullet}${text || "-"}`)}</w:t></w:r></w:p>`;
}

type ZipFile = {
  path: string;
  content: Uint8Array;
};

const encoder = new TextEncoder();

function xml(value: string) {
  return encoder.encode(value);
}

function createZip(files: ZipFile[]) {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.path);
    const crc = crc32(file.content);
    const local = concat([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(file.content.length),
      u32(file.content.length),
      u16(name.length),
      u16(0),
      name,
      file.content,
    ]);
    const central = concat([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(file.content.length),
      u32(file.content.length),
      u16(name.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      name,
    ]);

    localParts.push(local);
    centralParts.push(central);
    offset += local.length;
  }

  const central = concat(centralParts);
  const end = concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(central.length),
    u32(offset),
    u16(0),
  ]);

  return concat([...localParts, central, end]);
}

function u16(value: number) {
  const bytes = new Uint8Array(2);
  const view = new DataView(bytes.buffer);
  view.setUint16(0, value, true);
  return bytes;
}

function u32(value: number) {
  const bytes = new Uint8Array(4);
  const view = new DataView(bytes.buffer);
  view.setUint32(0, value >>> 0, true);
  return bytes;
}

function concat(parts: Uint8Array[]) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(total);
  let position = 0;

  for (const part of parts) {
    output.set(part, position);
    position += part.length;
  }

  return output;
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc ^= byte;
    for (let index = 0; index < 8; index += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
