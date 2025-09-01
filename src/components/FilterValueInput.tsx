import type { FilterValueInputProps } from '../core/types';
import { Button, Input } from './ui/basic';

export function FilterValueInput({
    filter,
    value,
    onChange,
    components = {}
}: FilterValueInputProps) {
    // Use provided components or defaults
    const InputComponent = components.Input || Input;
    const ButtonComponent = components.Button || Button;

    const handleChange = (newValue: unknown) => {
        onChange(newValue);
    };

    switch (filter.definition.type) {
        case 'text':
            return (
                <InputComponent
                    type="text"
                    value={(value as string) || ''}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={`Enter ${filter.definition.label.toLowerCase()}...`}
                    className="filter-text-input"
                />
            );

        case 'number':
            return (
                <InputComponent
                    type="number"
                    value={(value as number) || ''}
                    onChange={(e) => handleChange(Number(e.target.value) || undefined)}
                    placeholder={`Enter ${filter.definition.label.toLowerCase()}...`}
                    className="filter-number-input"
                />
            );

        case 'select':
            return (
                <div className="filter-select">
                    {filter.definition.options?.map((option) => (
                        <ButtonComponent
                            key={option.value}
                            variant={value === option.value ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleChange(option.value)}
                            className="w-full justify-start mb-1"
                            disabled={option.disabled}
                        >
                            {option.label}
                        </ButtonComponent>
                    ))}
                </div>
            );

        case 'multi-select':
            const selectedValues = Array.isArray(value) ? value : [];
            return (
                <div className="filter-multi-select">
                    {filter.definition.options?.map((option) => (
                        <ButtonComponent
                            key={option.value}
                            variant={selectedValues.includes(option.value) ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => {
                                const newValues = selectedValues.includes(option.value)
                                    ? selectedValues.filter(v => v !== option.value)
                                    : [...selectedValues, option.value];
                                handleChange(newValues);
                            }}
                            className="w-full justify-start mb-1"
                            disabled={option.disabled}
                        >
                            {selectedValues.includes(option.value) && (
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                            {option.label}
                        </ButtonComponent>
                    ))}
                </div>
            );

        case 'date':
            return (
                <InputComponent
                    type="date"
                    value={value ? new Date(value as string).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleChange(e.target.value ? new Date(e.target.value) : null)}
                    className="w-full"
                />
            );

        case 'date-range':
            const dateRange = (value as { from?: Date; to?: Date }) || {};
            return (
                <div className="filter-range">
                    <div className="filter-range__row">
                        <label className="filter-range__label">From:</label>
                        <InputComponent
                            type="date"
                            value={dateRange.from ? new Date(dateRange.from).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleChange({
                                ...dateRange,
                                from: e.target.value ? new Date(e.target.value) : undefined
                            })}
                            className="filter-range__input"
                        />
                    </div>
                    <div className="filter-range__row">
                        <label className="filter-range__label">To:</label>
                        <InputComponent
                            type="date"
                            value={dateRange.to ? new Date(dateRange.to).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleChange({
                                ...dateRange,
                                to: e.target.value ? new Date(e.target.value) : undefined
                            })}
                            className="filter-range__input"
                        />
                    </div>
                </div>
            );

        case 'number-range':
            const numberRange = (value as { min?: number; max?: number }) || {};
            return (
                <div className="filter-range">
                    <div className="filter-range__row">
                        <label className="filter-range__label">Min:</label>
                        <InputComponent
                            type="number"
                            value={numberRange.min ?? ''}
                            onChange={(e) => handleChange({
                                ...numberRange,
                                min: e.target.value ? Number(e.target.value) : undefined
                            })}
                            placeholder="Minimum value"
                            className="filter-range__input"
                        />
                    </div>
                    <div className="filter-range__row">
                        <label className="filter-range__label">Max:</label>
                        <InputComponent
                            type="number"
                            value={numberRange.max ?? ''}
                            onChange={(e) => handleChange({
                                ...numberRange,
                                max: e.target.value ? Number(e.target.value) : undefined
                            })}
                            placeholder="Maximum value"
                            className="filter-range__input"
                        />
                    </div>
                </div>
            );

        case 'boolean':
            return (
                <div className="space-y-1">
                    <ButtonComponent
                        variant={value === true ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleChange(true)}
                        className="w-full justify-start"
                    >
                        Yes
                    </ButtonComponent>
                    <ButtonComponent
                        variant={value === false ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleChange(false)}
                        className="w-full justify-start"
                    >
                        No
                    </ButtonComponent>
                </div>
            );

        default:
            return (
                <div className="p-2 text-sm text-gray-500">
                    Unsupported filter type: {filter.definition.type}
                </div>
            );
    }
}