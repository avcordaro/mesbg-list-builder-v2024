export function selectedOptionWithName(optionName: string) {
  return (opt) => opt.name === optionName && opt.quantity > 0;
}

export function selectedOptionWithType(optionType: string) {
  return (opt) => opt.type === optionType && opt.quantity > 0;
}
