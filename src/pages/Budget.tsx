import { useState } from 'react'

type BudgetRow = {
  id: string
  date: string
  libelle: string
  categorie: string
  montant: string
}

function newId() {
  return `row-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const defaultRow = (): BudgetRow => ({
  id: newId(),
  date: new Date().toISOString().slice(0, 10),
  libelle: '',
  categorie: '',
  montant: '',
})

export default function Budget() {
  const [rows, setRows] = useState<BudgetRow[]>([defaultRow()])

  const addRow = () => {
    setRows((prev) => [...prev, defaultRow()])
  }

  const updateCell = (id: string, field: keyof BudgetRow, value: string) => {
    if (field === 'id') return
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
  }

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  const total = rows.reduce((sum, r) => {
    const n = parseFloat((r.montant || '0').replace(',', '.'))
    return sum + (Number.isNaN(n) ? 0 : n)
  }, 0)

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Budget</h1>
      </header>
      <main className="budget-page">
        <div className="budget-table-wrap">
          <table className="budget-table">
            <thead>
              <tr>
                <th className="budget-table__th budget-table__th--date">Date</th>
                <th className="budget-table__th budget-table__th--libelle">Libellé</th>
                <th className="budget-table__th budget-table__th--categorie">Catégorie</th>
                <th className="budget-table__th budget-table__th--montant">Montant (DH)</th>
                <th className="budget-table__th budget-table__th--action" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="budget-table__row">
                  <td className="budget-table__td">
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) => updateCell(row.id, 'date', e.target.value)}
                      className="budget-table__input"
                    />
                  </td>
                  <td className="budget-table__td">
                    <input
                      type="text"
                      value={row.libelle}
                      onChange={(e) => updateCell(row.id, 'libelle', e.target.value)}
                      className="budget-table__input"
                      placeholder="Description"
                    />
                  </td>
                  <td className="budget-table__td">
                    <input
                      type="text"
                      value={row.categorie}
                      onChange={(e) => updateCell(row.id, 'categorie', e.target.value)}
                      className="budget-table__input"
                      placeholder="Ex: Alimentation"
                    />
                  </td>
                  <td className="budget-table__td budget-table__td--montant">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={row.montant}
                      onChange={(e) => updateCell(row.id, 'montant', e.target.value)}
                      className="budget-table__input"
                      placeholder="0,00"
                    />
                  </td>
                  <td className="budget-table__td budget-table__td--action">
                    <button
                      type="button"
                      className="budget-table__remove"
                      onClick={() => removeRow(row.id)}
                      aria-label="Supprimer la ligne"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="budget-table__add-row"
            onClick={addRow}
            aria-label="Ajouter une ligne"
          >
            + Ajouter une ligne
          </button>
        </div>
        <div className="budget-total">
          <span className="budget-total__label">Total</span>
          <span className={`budget-total__value ${total < 0 ? 'budget-total__value--negative' : ''}`}>
            {total.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH
          </span>
        </div>
      </main>
    </>
  )
}
