'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Navbar from '@/components/navbar'
import ReactSelect from 'react-select'
import { BASE_URL } from '@/utils/UrlConstant'
import { useAuth } from '@/contexts/AuthContext'

const formSchema = z.object({
    firstName: z.string().min(2, {
        message: "First Name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Please enter a valid date in YYYY-MM-DD format.",
    }),
    institution: z.string().min(2, {
        message: "Institution name must be at least 2 characters.",
    }),
    course: z.string().min(1, {
        message: "Please select your course.",
    }),
    yearLevel: z.string().min(1, {
        message: "Please select your year level.",
    }),
    programmingExperience: z.string().min(1, {
        message: "Please select your programming experience level.",
    }),
    preferredLanguages: z.array(z.string()).min(1, {
        message: "Please select at least one programming language.",
    }),
    expectations: z.string().min(10, {
        message: "Please provide at least 10 characters about your expectations.",
    }),
})

export default function SignUpPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            dateOfBirth: "",
            institution: "",
            course: "",
            yearLevel: "",
            programmingExperience: "",
            preferredLanguages: [],
            expectations: "",
        },
    })

    const { toast } = useToast()  
    const auth = useAuth() 

    function onSubmit(values: z.infer<typeof formSchema>) {

        fetch(`${BASE_URL}/API/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        }).then(response => { 

            if (response.ok) {
                toast({"description": "Registration successful. Please login to continue."})
                auth.login(values.email, values.password)
                auth.checkAuth()
            } 
            else {
                toast({"description":"Account with the email already existing.", variant: "destructive"})
            } 

        } 
        )
    
    }

    const courseOptions = [
        { value: 'computer_science', label: 'Bachelor of Computer Science' },
        { value: 'information_technology', label: 'Bachelor of Information Technology' },
        { value: 'software_engineering', label: 'Bachelor of Software Engineering' },
        { value: 'computer_engineering', label: 'Bachelor of Computer Engineering' },
        { value: 'data_science', label: 'Bachelor of Data Science' },
    ]

    const programmingLanguagesOptions = [
        { value: 'python', label: 'Python' },
        { value: 'javascript', label: 'JavaScript' },
        { value: 'java', label: 'Java' },
        { value: 'c++', label: 'C++' },
        { value: 'c#', label: 'C#' },
        { value: 'go', label: 'Go' },
        { value: 'rust', label: 'Rust' },
        { value: 'typescript', label: 'TypeScript' },
        // Add more languages as needed
    ]

    return (
        <>
            <Navbar />
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Register for UCode</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" autoComplete="off">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="off" required placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="off" required placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="off" required type="email" placeholder="johndoe@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="off" required type="password" placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="off" required type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="institution"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Institution</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="off" required placeholder="University of Technology" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="course"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your course" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courseOptions.map((course) => (
                                                    <SelectItem key={course.value} value={course.value}>
                                                        {course.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="yearLevel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Year Level</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your year level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">First Year</SelectItem>
                                            <SelectItem value="2">Second Year</SelectItem>
                                            <SelectItem value="3">Third Year</SelectItem>
                                            <SelectItem value="4">Fourth Year</SelectItem>
                                            <SelectItem value="5">Fifth Year or Above</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="programmingExperience"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Programming Experience</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your experience level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="beginner">Beginner</SelectItem>
                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                            <SelectItem value="advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="preferredLanguages"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preferred Programming Languages</FormLabel>
                                    <FormControl>
                                        <ReactSelect
                                            isMulti
                                            options={programmingLanguagesOptions}
                                            value={programmingLanguagesOptions.filter(option =>
                                                field.value.includes(option.value)
                                            )}
                                            onChange={(selectedOptions) => {
                                                field.onChange(selectedOptions.map(option => option.value))
                                            }}
                                            placeholder="Select your preferred programming languages"
                                            classNamePrefix="react-select"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Select the programming languages you're most interested in.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expectations"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Expectations</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            autoComplete="off"
                                            required
                                            placeholder="What do you hope to achieve from this course?"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Register</Button>
                    </form>
                </Form>
            </div>
        </>
    )
}