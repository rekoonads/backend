import {model, Schema} from 'mongoose'; 


const audiencesSchema = new Schema({
    audId: { type: Schema.Types.ObjectId, auto: true }, 
    artsNdEnt: [String],
    automotive: [String],
    business: [String],
    careers: [String],
    education: [String],
    familyNdParenting: [String],
    healthNdFitness: [String],
    hobbiesNdInterests: [String],
    homeNdGarden: [String],
    lawGovtNdPolitics: [String],
    news: [String],
    personalFinance: [String],
    society: [String],
    science: [String],
    pets: [String],
    sports: [String],
    styleNdfashion: [String],
    technologyNdComputing: [String],
    travel: [String],
    realEstate: [String],
    shopping: [String],
    religionNdSpirituality: [String],
    uncategorized: [String],
    nonStandardContent: [String],
    illegalContent: [String] 
}, {
    timestamps: true
});
export const Aud = model('Audiences', audiencesSchema);