#!/bin/bash

# This script updates all student pages to use session-based authentication
# and changes the theme from blue to gold

echo "Updating student panel files..."

# Files to update
FILES=(
  "src/app/student/classes/page.tsx"
  "src/app/student/classes/[yearId]/page.tsx"
  "src/app/student/classes/[yearId]/[typeId]/page.tsx"
  "src/app/student/classes/[yearId]/[typeId]/[topicId]/page.tsx"
  "src/app/student/resources/page.tsx"
  "src/app/student/profile/page.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    
    # Replace useStore with getCurrentUser import
    sed -i '' "s/import { useStore } from '@\/lib\/store';/import { getCurrentUser } from '@\/lib\/actions\/auth';/" "$file"
    
    # Replace currentUser?.id with session check pattern
    sed -i '' "s/const { currentUser } = useStore();/const [currentUser, setCurrentUser] = useState<any>(null);/" "$file"
    
    # Add useEffect to fetch session
    sed -i '' "/const \[currentUser, setCurrentUser\] = useState/a\\
\\
    useEffect(() => {\\
        async function fetchSession() {\\
            const session = await getCurrentUser();\\
            if (session) {\\
                setCurrentUser({ id: session.userId, name: session.name, email: session.email });\\
            }\\
        }\\
        fetchSession();\\
    }, []);
" "$file"
    
  fi
done

echo "Done!"
