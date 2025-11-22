import  './TranscriptTable.css'
import {ChevronDown} from 'lucide-react';
import { useState } from 'react';

function Entry(props){
  const callerid = props.callerid;
  const agentid = props.agentid;
  const transcript = props.transcript;

  const [open, setOpen] = useState(false);

    return (
        <div class="wrapper">
              <button
                class="rowButton"
                onClick={() => {setOpen(!open);}}
                >
                <div class="cell">
                    {callerid}
                </div>
                <div class="cell">
                    {agentid}
                </div>
                <div class="chevronCell">
                  <ChevronDown
                    class="chevron"
                    style={{
                      transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </div>
              </button>
              {(open) ? 
              <div class="expandedContent">
                  <div class="detailsGrid">
                    <div class="detailItem">
                      <div>
                        <p class="detailLabel">Transcript</p>
                        <p class="transcriptValue">{transcript}</p>
                      </div>
                    </div>
                    
                    <div class="transcriptInfo">
                      <div>
                        <p class="detailLabel">D1</p>
                        <p class="detailValue">V!</p>
                        
                      </div>
                      <div>
                        <p class="detailLabel">D1</p>
                        <p class="detailValue">V!</p>
                      </div>
                    </div>
                    
                  </div>
                </div>
                : null}
          </div>
    )
}


export default function TranscriptTable(){

  function boldWords(text) {
    const words = ['Client', 'Banker']
  const regex = new RegExp(`\\b(${words.join("|")})\\b`, "gi");

  return text.split(regex).map((part, i) =>
    words.includes(part) ? <strong key={i}>{part}</strong> : part
  );
  }
  const transcripts = [
    {
      calledir : "C182",
      agentid : "A47",
      transcript : `Banker: Good afternoon. Before we start, I need to be clear that everything we discuss today is preliminary and non-binding. These are indicative terms only and are all subject to full credit approval and final documentation. This is not a commitment to lend.

Client: Understood. I just want to know what a realistic structure looks like.

Banker: Great. A few required regulatory points up front. First, under our Customer Identification Program and anti-money laundering rules, we have to verify your identity and the identity of your business before we can treat any application as complete or move to funding. For a company, we also must identify and certify all beneficial owners who hold 25 percent or more, plus one control person. We will also ask about the nature of your business and source of funds.

Client: That makes sense.

Banker: Second, any financial and personal information you provide will be handled under our Privacy Policy, as required by federal law. We can provide you a copy electronically or in writing. Third, once you submit a completed application and all required documents, we are required under Regulation B to give you a credit decision within 30 days, along with a written notice if we decline or modify the request.

Client: All clear. My goal is to finance expansion but keep room for future acquisitions.

Banker: Understood. Given that, we would typically look at a term loan for the expansion, and possibly a small revolving line for working capital flexibility. I will walk through structure, costs, collateral, covenants, and constraints so there are no surprises.

Client: Go ahead.

Banker: On structure, a realistic initial range based on your size would be a term loan between 500k and 750k, amortized over 5 to 7 years, plus an optional revolving line, say 250k, for short-term needs. Final numbers depend on underwriting.

Client: What about pricing and fees?

Banker: Indicative fixed rate on the term loan would be in the 6.5 to 7.5 percent range. The revolver, if you take it, would typically be a floating rate based on our base rate plus a margin. There is an origination fee of about 1 percent on the committed amount. Standard third-party costs include appraisal, legal, and due diligence; those often run in the 5,000 to 8,000 dollar range depending on complexity. For the revolver, there is usually a commitment or unused line fee, for example 0.25 to 0.50 percent per year on the undrawn portion. We will summarize all of this in a full written fee schedule before you decide.

Client: That’s detailed. What are you taking as collateral?

Banker: For a deal of this type, we would expect a first-position security interest over your business assets through a general security agreement. If real estate is involved, we may require a mortgage on that property. We also normally require a personal guarantee from the majority owner. A default would occur if payments are missed, key financial covenants are breached, bankruptcy or insolvency events occur, or if there is material misrepresentation or impairment of collateral.

Client: I appreciate the clarity. Now talk to me about covenants and how they impact my future leverage.

Banker: Important point. There are two main categories: financial covenants and negative covenants. On the financial side, we would likely require a minimum debt service coverage ratio of at least 1.20 and a maximum leverage or debt-to-EBITDA level consistent with our internal policy. These thresholds are driven by our risk standards and regulatory expectations and are not purely negotiable. We can sometimes adjust levels at the margin, but we cannot remove the core risk controls.

Client: And the negative covenants?

Banker: Negative covenants will restrict you from taking on additional debt, making large capital expenditures, selling significant assets, or paying extraordinary dividends without lender consent. This directly affects your acquisition strategy. We can structure them to allow acquisitions above a certain size with prior notice and approval, but I want to be upfront that the bank cannot support unlimited leverage. We are also constrained by regulatory guidance on leveraged lending and by our own risk appetite, so we cannot simply maximize leverage if it pushes your profile into high-risk territory.

Client: So there is some flexibility, but within your policy and regulatory limits.

Banker: Exactly. Our role is to provide capital while keeping the bank safe and sound. That means some elements are non-negotiable: having covenants, having adequate collateral, and staying inside our leverage and risk limits. Within that framework, we can tailor terms to align with your growth plans.

Client: Understood. What does the realistic timeline look like?

Banker: For a commercial facility of this type, you should expect roughly 30 to 45 days from a complete application to funding. The main drivers of timing are third-party reports like appraisals and, if needed, environmental assessments, plus internal credit committee review and documentation. Underwriting analysis itself may only take a few days, but we cannot fund until all verification, third-party work, and approvals are complete. I do not want to promise you a one-week close when that would not be realistic.

Client: I appreciate not being oversold on timing. What do you need from me to start?

Banker: We will need the last two years of financial statements, year-to-date numbers, 12-month cash flow projections, your corporate documents, a list of all owners and their ownership percentages, and information on collateral. We will also need identification documents for you and all beneficial owners at 25 percent or more, plus the control person, so we can satisfy our CIP and beneficial ownership requirements.

Client: I can assemble that.

Banker: Once we receive the full package, we will treat the file as an application, perform our due diligence, and then provide you with a written, non-binding term sheet that sets out structure, pricing, fees, collateral, covenants, and key conditions. Only after you accept the term sheet and we complete full approval and documentation would we move to a binding commitment and closing.

Client: That gives me a realistic view of what to expect. Let’s move ahead with the information request.

Banker: Great. I will send you the checklist today so we can begin the process in a fully compliant and transparent way.`,
      risk : 0.76
    }

  ]

  return(
    <>
      <div class="table">
        <div class="header">
            <div class="headerCell">Name</div>
            <div class="headerCell">Role</div>
            <div class="headerCell"></div>
        </div>
          {transcripts.map((item)=>(
            <Entry 
              callerid={item.callerid}
              agentid={item.agentid}
              transcript={boldWords(item.transcript)}
              risk={item.risk}
            />
          ))}
      </div>
    </>
  )
}