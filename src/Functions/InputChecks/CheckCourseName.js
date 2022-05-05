// Return whether the given course is valid to submit to database
// Returns [bool, "error text"]
export const CheckCourseName = (courseName) => {
    const maxCharLength = 70

    const r = /^[a-z0-9 ()]+$/i
    
    // Return true (valid) if number of chars is less or equal to the limit
    // And is only alphanumeric (letters + numbers) and "()" or "[]"
    if (courseName.length <= maxCharLength) {
        const match = r.exec(courseName)
    
        if (match && match[0] === courseName) {
            return [true, ""]
        }
        else {
            return [false, "Course Name can only contain letters, numbers, (), and spaces"]
        }
    }
    else {
        return [false, "Course Name must be max of " + String(maxCharLength) + " chars"]
    }
};
