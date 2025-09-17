import { useState, useEffect, useCallback } from 'react'

// Smart state management hook with persistence and validation
export const useSmartState = (key, initialValue, options = {}) => {
  const {
    persist = false,
    validate = null,
    transform = null,
    debounce = 0
  } = options

  // Get initial value from localStorage if persisting
  const getInitialValue = () => {
    if (persist) {
      try {
        const stored = localStorage.getItem(`smart_state_${key}`)
        if (stored !== null) {
          const parsed = JSON.parse(stored)
          return transform ? transform(parsed) : parsed
        }
      } catch (error) {
        console.warn(`Failed to load state for key ${key}:`, error)
      }
    }
    return initialValue
  }

  const [state, setState] = useState(getInitialValue)
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState(null)

  // Validate state
  const validateState = useCallback((value) => {
    if (!validate) return { isValid: true, error: null }
    
    try {
      const result = validate(value)
      if (typeof result === 'boolean') {
        return { isValid: result, error: result ? null : 'Invalid value' }
      }
      return { isValid: result.isValid, error: result.error || null }
    } catch (err) {
      return { isValid: false, error: err.message }
    }
  }, [validate])

  // Update state with validation
  const updateState = useCallback((newValue) => {
    const transformedValue = transform ? transform(newValue) : newValue
    const validation = validateState(transformedValue)
    
    setIsValid(validation.isValid)
    setError(validation.error)
    
    if (validation.isValid) {
      setState(transformedValue)
      
      // Persist to localStorage if enabled
      if (persist) {
        try {
          localStorage.setItem(`smart_state_${key}`, JSON.stringify(transformedValue))
        } catch (err) {
          console.warn(`Failed to persist state for key ${key}:`, err)
        }
      }
    }
  }, [key, persist, transform, validateState])

  // Debounced update
  useEffect(() => {
    if (debounce > 0) {
      const timer = setTimeout(() => {
        updateState(state)
      }, debounce)
      return () => clearTimeout(timer)
    }
  }, [state, debounce, updateState])

  // Clear state
  const clearState = useCallback(() => {
    setState(initialValue)
    setIsValid(true)
    setError(null)
    if (persist) {
      localStorage.removeItem(`smart_state_${key}`)
    }
  }, [key, persist, initialValue])

  // Reset to initial value
  const resetState = useCallback(() => {
    setState(initialValue)
    setIsValid(true)
    setError(null)
  }, [initialValue])

  return {
    state,
    setState: updateState,
    isValid,
    error,
    clearState,
    resetState
  }
}

// Smart form state management
export const useSmartForm = (initialValues = {}, options = {}) => {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    persist = false
  } = options

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Field validation
  const validateField = useCallback((name, value) => {
    const field = initialValues[name]
    if (!field || !field.validate) return null

    try {
      const result = field.validate(value, values)
      if (typeof result === 'boolean') {
        return result ? null : field.errorMessage || 'Invalid value'
      }
      return result.isValid ? null : result.error || field.errorMessage || 'Invalid value'
    } catch (err) {
      return err.message || 'Validation error'
    }
  }, [initialValues, values])

  // Update field value
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    if (validateOnChange) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [validateOnChange, validateField])

  // Handle field blur
  const handleFieldBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    
    if (validateOnBlur) {
      const error = validateField(name, values[name])
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [validateOnBlur, validateField, values])

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {}
    let isValid = true

    Object.keys(initialValues).forEach(name => {
      const error = validateField(name, values[name])
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [initialValues, values, validateField])

  // Submit form
  const submitForm = useCallback(async (onSubmit) => {
    setIsSubmitting(true)
    
    try {
      const isValid = validateForm()
      if (isValid && onSubmit) {
        await onSubmit(values)
      }
      return isValid
    } finally {
      setIsSubmitting(false)
    }
  }, [validateForm, values])

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    handleFieldBlur,
    validateForm,
    submitForm,
    resetForm,
    isValid: Object.keys(errors).length === 0
  }
}

// Smart API state management
export const useSmartAPI = (apiFunction, options = {}) => {
  const {
    immediate = false,
    onSuccess = null,
    onError = null,
    retry = 0,
    retryDelay = 1000
  } = options

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiFunction(...args)
      setData(result)
      setRetryCount(0)
      if (onSuccess) onSuccess(result)
      return result
    } catch (err) {
      setError(err)
      
      if (retryCount < retry) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          execute(...args)
        }, retryDelay)
      } else {
        if (onError) onError(err)
      }
      
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunction, onSuccess, onError, retry, retryCount, retryDelay])

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  return {
    data,
    loading,
    error,
    execute,
    retryCount
  }
}
