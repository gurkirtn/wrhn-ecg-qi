const patientIdPattern = /^(?:PT|WRHN)-\d{5}$/i;

export function isValidPatientId(value: string): boolean {
  return patientIdPattern.test(value.trim());
}

export function isSupportedEcgFile(file: File): boolean {
  return /\.(?:png|jpe?g|pdf|xml|dcm)$/i.test(file.name) && file.size <= 20 * 1024 * 1024;
}
