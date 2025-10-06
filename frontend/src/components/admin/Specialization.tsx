import { Employee } from "@/types/adminTypes"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { alloHealthClinicLocation, doctorSpecializations } from "@/lib/constants"

export function Specialization({ formData, handleChange, disabled }: {
    formData: Omit<Employee, "id">,
    handleChange: (arg0: string) => void,
    disabled: boolean
}) {
    return (
        <>
            <Label htmlFor="specialization">Specialization</Label>
            <Select value={formData.specialization} onValueChange={handleChange} disabled={disabled}>
                <SelectTrigger id="specialization">
                    <SelectValue placeholder="Select specialization field" />
                </SelectTrigger>
                <SelectContent>
                    {doctorSpecializations.map((field, idx) => {
                        return (
                            <SelectItem key={idx} value={field.name} title={field.description}>{field.name}</SelectItem>
                        )
                    })}

                </SelectContent>
            </Select>
        </>
    )
}

export function Location({ formData, disabled, handleChange }: {
    formData: Omit<Employee, "id">,
    disabled: boolean,
    handleChange: (arg0: string) => void
}) {
    return (
        <>
            <Label htmlFor="location">Location</Label>
            <Select value={formData.location} onValueChange={handleChange} disabled={disabled}>
                <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                    {alloHealthClinicLocation.map((location, idx) => {
                        return (
                            <SelectItem key={idx} value={location}>{location}</SelectItem>
                        )
                    })}

                </SelectContent>
            </Select>

        </>
    )
}