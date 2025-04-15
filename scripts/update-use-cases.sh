#!/bin/bash

# Script to update repository injection in use cases
# Run with: bash scripts/update-use-cases.sh

# Create the directory structure if it doesn't exist
mkdir -p scripts

echo "Finding use cases that need to be updated..."

# Find all use case files
USE_CASE_FILES=$(find src/application/use-cases -name "*.use-case.ts")

# Process each file
for file in $USE_CASE_FILES; do
  echo "Processing $file..."
  
  # Check which repository types are used in this file
  if grep -q "IUserRepository" "$file"; then
    # Add Inject import if needed
    if ! grep -q "Inject" "$file"; then
      sed -i '' 's/import {/import { Inject, /g' "$file"
    fi
    
    # Add repository token import if needed
    if ! grep -q "USER_REPOSITORY" "$file"; then
      echo "import { USER_REPOSITORY } from '../../../domain/constants/repository.tokens';" >> "$file.tmp"
      cat "$file" >> "$file.tmp"
      mv "$file.tmp" "$file"
    fi
    
    # Update constructor parameter
    sed -i '' 's/constructor(private readonly \([a-zA-Z0-9]*\): IUserRepository)/constructor(@Inject(USER_REPOSITORY) private readonly \1: IUserRepository)/g' "$file"
  fi
  
  if grep -q "IStaffRepository" "$file"; then
    # Add Inject import if needed
    if ! grep -q "Inject" "$file"; then
      sed -i '' 's/import {/import { Inject, /g' "$file"
    fi
    
    # Add repository token import if needed
    if ! grep -q "STAFF_REPOSITORY" "$file"; then
      echo "import { STAFF_REPOSITORY } from '../../../domain/constants/repository.tokens';" >> "$file.tmp"
      cat "$file" >> "$file.tmp"
      mv "$file.tmp" "$file"
    fi
    
    # Update constructor parameter
    sed -i '' 's/constructor(private readonly \([a-zA-Z0-9]*\): IStaffRepository)/constructor(@Inject(STAFF_REPOSITORY) private readonly \1: IStaffRepository)/g' "$file"
  fi
  
  if grep -q "IItemRepository" "$file"; then
    # Add Inject import if needed
    if ! grep -q "Inject" "$file"; then
      sed -i '' 's/import {/import { Inject, /g' "$file"
    fi
    
    # Add repository token import if needed
    if ! grep -q "ITEM_REPOSITORY" "$file"; then
      echo "import { ITEM_REPOSITORY } from '../../../domain/constants/repository.tokens';" >> "$file.tmp"
      cat "$file" >> "$file.tmp"
      mv "$file.tmp" "$file"
    fi
    
    # Update constructor parameter
    sed -i '' 's/constructor(private readonly \([a-zA-Z0-9]*\): IItemRepository)/constructor(@Inject(ITEM_REPOSITORY) private readonly \1: IItemRepository)/g' "$file"
  fi
  
  if grep -q "IStockRepository" "$file"; then
    # Add Inject import if needed
    if ! grep -q "Inject" "$file"; then
      sed -i '' 's/import {/import { Inject, /g' "$file"
    fi
    
    # Add repository token import if needed
    if ! grep -q "STOCK_REPOSITORY" "$file"; then
      echo "import { STOCK_REPOSITORY } from '../../../domain/constants/repository.tokens';" >> "$file.tmp"
      cat "$file" >> "$file.tmp"
      mv "$file.tmp" "$file"
    fi
    
    # Update constructor parameter
    sed -i '' 's/constructor(private readonly \([a-zA-Z0-9]*\): IStockRepository)/constructor(@Inject(STOCK_REPOSITORY) private readonly \1: IStockRepository)/g' "$file"
  fi
  
  if grep -q "ICustomerRepository" "$file"; then
    # Add Inject import if needed
    if ! grep -q "Inject" "$file"; then
      sed -i '' 's/import {/import { Inject, /g' "$file"
    fi
    
    # Add repository token import if needed
    if ! grep -q "CUSTOMER_REPOSITORY" "$file"; then
      echo "import { CUSTOMER_REPOSITORY } from '../../../domain/constants/repository.tokens';" >> "$file.tmp"
      cat "$file" >> "$file.tmp"
      mv "$file.tmp" "$file"
    fi
    
    # Update constructor parameter
    sed -i '' 's/constructor(private readonly \([a-zA-Z0-9]*\): ICustomerRepository)/constructor(@Inject(CUSTOMER_REPOSITORY) private readonly \1: ICustomerRepository)/g' "$file"
  fi
  
  if grep -q "ITransactionRepository" "$file"; then
    # Add Inject import if needed
    if ! grep -q "Inject" "$file"; then
      sed -i '' 's/import {/import { Inject, /g' "$file"
    fi
    
    # Add repository token import if needed
    if ! grep -q "TRANSACTION_REPOSITORY" "$file"; then
      echo "import { TRANSACTION_REPOSITORY } from '../../../domain/constants/repository.tokens';" >> "$file.tmp"
      cat "$file" >> "$file.tmp"
      mv "$file.tmp" "$file"
    fi
    
    # Update constructor parameter
    sed -i '' 's/constructor(private readonly \([a-zA-Z0-9]*\): ITransactionRepository)/constructor(@Inject(TRANSACTION_REPOSITORY) private readonly \1: ITransactionRepository)/g' "$file"
  fi
  
  if grep -q "IDebtRepository" "$file"; then
    # Add Inject import if needed
    if ! grep -q "Inject" "$file"; then
      sed -i '' 's/import {/import { Inject, /g' "$file"
    fi
    
    # Add repository token import if needed
    if ! grep -q "DEBT_REPOSITORY" "$file"; then
      echo "import { DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';" >> "$file.tmp"
      cat "$file" >> "$file.tmp"
      mv "$file.tmp" "$file"
    fi
    
    # Update constructor parameter
    sed -i '' 's/constructor(private readonly \([a-zA-Z0-9]*\): IDebtRepository)/constructor(@Inject(DEBT_REPOSITORY) private readonly \1: IDebtRepository)/g' "$file"
  fi
done

echo "Done! All use cases updated." 