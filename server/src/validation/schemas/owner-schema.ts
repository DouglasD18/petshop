import { z } from "zod";
import { Owner } from '../../domain/models/owner';

const CONTACT_REGEX = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)(?:((?:9\d|[2-9])\d{4})\-?(\d{4}))$/;

const NAME_LENGTH_ERROR = "Owner name must have length between 3 and 100";
const ADDRESS_LENGTH_ERROR = "Owner length must have length between 12 and 250"

const OwnerSchema = z.object({
  name: z.string().min(3, NAME_LENGTH_ERROR).max(100, NAME_LENGTH_ERROR).nonempty("Owner name is required"),
  contact: z.string().nonempty("Owner contact is required")
  .regex(CONTACT_REGEX, "Owner contact must the correct format"),
  address: z.string().min(12, ADDRESS_LENGTH_ERROR).max(250, ADDRESS_LENGTH_ERROR).nonempty("Owner address is required")
});

export const validateOwnerSchema = (data: Owner) => OwnerSchema.safeParse(data);
