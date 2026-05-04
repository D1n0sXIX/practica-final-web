import PDFDocument from 'pdfkit'

export const generatePDF = (deliveryNote) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument()
        const buffers = []

        doc.on('data', chunk => buffers.push(chunk))
        doc.on('end', () => resolve(Buffer.concat(buffers)))
        doc.on('error', reject)

        doc.fontSize(20).text('ALBARÁN', { align: 'center' })
        doc.moveDown()
        doc.fontSize(12).text(`ID: ${deliveryNote._id}`)
        doc.text(`Fecha: ${deliveryNote.workDate ? new Date(deliveryNote.workDate).toLocaleDateString('es-ES') : 'N/A'}`)
        doc.moveDown()
        doc.font('Helvetica-Bold').text('CLIENTE').font('Helvetica')
        doc.text(`Nombre: ${deliveryNote.client?.name || 'N/A'}`)
        doc.text(`Email: ${deliveryNote.client?.email || 'N/A'}`)
        doc.moveDown()
        doc.font('Helvetica-Bold').text('PROYECTO').font('Helvetica')
        doc.text(`Nombre: ${deliveryNote.project?.name || 'N/A'}`)
        doc.text(`Código: ${deliveryNote.project?.projectCode || 'N/A'}`)
        doc.moveDown()
        doc.font('Helvetica-Bold').text('TRABAJO').font('Helvetica')
        doc.text(`Descripción: ${deliveryNote.description || 'N/A'}`)
        if (deliveryNote.format === 'hours') {
            doc.text(`Horas: ${deliveryNote.hours}`)
        } else {
            doc.text(`Material: ${deliveryNote.material} - Cantidad: ${deliveryNote.quantity} ${deliveryNote.unit}`)
        }
        doc.moveDown()
        doc.text(`Firmado: ${deliveryNote.signed ? 'Sí' : 'No'}`)
        

        doc.end()
    })
}