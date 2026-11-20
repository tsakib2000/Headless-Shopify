import { useId } from 'react'

function optionValue(variant, name) {
  return variant.selectedOptions.find((option) => option.name === name)?.value
}

export default function VariantPicker({ options, variants, selectedVariant, onSelect, disabled }) {
  const id = useId()

  return (
    <div className="mt-6 space-y-5 rounded-xl border border-line bg-canvas p-4">
      {options.map(({ name, optionValues }, index) => {
        const earlierOptions = options.slice(0, index)
        const laterOptions = options.slice(index + 1)
        const choices = new Map()

        for (const variant of variants) {
          if (!earlierOptions.every((option) =>
            optionValue(variant, option.name) === optionValue(selectedVariant, option.name),
          )) continue

          const value = optionValue(variant, name)
          if (!choices.has(value)) choices.set(value, [])
          choices.get(value).push(variant)
        }

        const currentValue = optionValue(selectedVariant, name)
        return (
          <fieldset key={name} disabled={disabled}>
            <legend className="mb-2.5 text-sm font-semibold">
              {name} <span className="ml-1.5 font-normal text-muted">{currentValue}</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {optionValues.map(({ name: value }) => {
                const matches = choices.get(value) ?? []
                const inStock = matches.find(({ availableForSale }) => availableForSale)
                const exact = matches.find((variant) => laterOptions.every((option) =>
                  optionValue(variant, option.name) === optionValue(selectedVariant, option.name),
                ))
                const nextVariant = exact ?? inStock ?? matches[0]

                return (
                  <label key={value} className="relative inline-flex max-w-full">
                    <input
                      className="peer sr-only"
                      type="radio"
                      name={`${id}-${index}`}
                      value={value}
                      checked={currentValue === value}
                      disabled={!nextVariant}
                      onChange={() => onSelect(nextVariant.id)}
                    />
                    <span className={`flex min-h-11 cursor-pointer flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium [overflow-wrap:anywhere] hover:border-brand peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand peer-disabled:cursor-not-allowed peer-disabled:opacity-55 ${inStock ? '' : 'border-dashed'}`}>
                      {value}
                      {!inStock && (
                        <span className="text-xs font-normal opacity-80">
                          {nextVariant ? 'Sold out' : 'Unavailable'}
                        </span>
                      )}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        )
      })}
    </div>
  )
}
