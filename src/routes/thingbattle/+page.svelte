<script>
    import {env} from "$env/dynamic/public";
    import { onMount } from "svelte";
    import {fade} from "svelte/transition";
    import {goto} from "$app/navigation";
    let thing1 = "";
    let thing2 = "";
    let thing1Percentages;
    let thing2Percentages;
    let voting = false;
    let out = true;

    async function random(){
        voting = false;
        thing1Percentages = null;
        thing2Percentages = null;
        const response = await fetch(`${env.PUBLIC_CHOICES_API}/random`);
        const data = await response.json();
        thing1 = data.item1;
        thing2 = data.item2;
    }

    async function vote(item){
        voting = true;
        const params = new URLSearchParams();
        params.append("choice", item);
        params.append("other", item === thing1 ? thing2 : thing1);
        const response = await fetch(`${env.PUBLIC_CHOICES_API}/choice?${params.toString()}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({item})
        });
        const data = await response.json();

        if(item === thing1){
          thing1Percentages = data.chosenPercentage || 0;
            thing2Percentages = data.otherPercentage || 0;
        } else {
            thing2Percentages = data.chosenPercentage || 0;
            thing1Percentages = data.otherPercentage || 0; 
        }

        
    }

    async function load(){
        await random();
        out = false;
    }

    load();
</script>

{#if out}
<div class="transition" in:fade={{duration: 500}} 
    out:fade={{duration: 500}}
></div>
{/if}
<a href="/" class="back"
    on:click|preventDefault={() => {
        out = true;
        setTimeout(() => {
            goto("/");
        }, 500);
    }}
><button>Back</button></a>
<a href="/thingbattle/results" class="results"
    on:click|preventDefault={() => {
        out = true;
        setTimeout(() => {
            goto("/thingbattle/results");
        }, 500);
    }}
><button>Results</button></a>
<div class="choose">
    Thing Battle
 </div>
<div class="divider">
<button class="thing" style="background-image: url('{env.PUBLIC_CHOICES_API}/{thing1.replace(" ", "_").toLowerCase()}.png')"
    on:click={() => vote(thing1)}
        disabled={voting}
    >

 
    <div class="thing-overlay">
        <h1>{thing1}</h1>
        {#if thing1Percentages}
            <h2>{thing1Percentages}%</h2>
        {/if}
    </div>
</button>

<div class="or">
    {#if !thing1Percentages && !thing2Percentages}
 
    <h1>
        {#if thing1 && thing2}
            or
        {:else}
            Loading...
        {/if}
    </h1>
    {:else}
    <button on:click={random} class="next">Next</button>
    {/if}
    </div>
<button class="thing" style="background-image: url('{env.PUBLIC_CHOICES_API}/{thing2.replace(" ", "_").toLowerCase()}.png')"
    on:click={() => vote(thing2)}        disabled={voting}

>
    <div class="thing-overlay">
        <h1>{thing2}</h1>
        {#if thing2Percentages}
            <h2>{thing2Percentages}%</h2>
        {/if}
  
    </div>
</button>
</div>
<style>
    .divider {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100vh;
    }
    .thing {
        width: 50%;
        height: 100vh;
        background-size: cover;
        background-position: center;
        position: relative;
    }
    .thing-overlay {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        color: white;

    }

  .thing-overlay h1 {
        font-size: 3em;
        margin: 0;
  }
  .thing-overlay h2 {
        font-size: 2em;
        margin: 0;
  }
    h1 {
        margin: 0;
    }

    .choose {
       position: absolute;
            left: 50%;
            top: 5%;
            transform: translate(-50%, 0);
            font-size: 4em;
            color: white;
            z-index: 1;
            font-weight: bold;
            font-family: 'Arial';

    }

    .or {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 4em;
        color: white;
        z-index: 1;
        font-weight: bold;
        font-family: 'Arial';
    }

    .thing h2 {
        font-size: 1.5em;
    }

    .next {
        font-size: 0.5em;
        padding: 0.5em 1em;
        border: none;
        background: white;
        color: black;
        font-weight: bold;
        cursor: pointer;
        border-radius: 5px;
    }

    @media (max-width: 768px) {
        .divider {
            flex-direction: column;
        }
        .thing {
            width: 100%;
            height: 50vh;
        }
        .choose {
            top: 5%;
            transform: translate(-50%, 0);
            font-size: 3em;
            width: 100%;
            text-align: center;
        }
        .or {
            top: 50%;
            transform: translate(-50%, -50%);
        }

        .thing-overlay h1 {
            font-size: 2em;
        }
        .thing-overlay h2 {
            font-size: 1.5em;
        }

       /*back and results under title*/
        .back {
            margin-top: 80px;
        }
        .results {
            margin-top: 80px;
        }

        
    }

    .back {
        position: absolute;
        color: white;
        top: 0;
        left: 0;
        padding: 1em;
        z-index: 1;
        font-size: 1.5em;
        font-weight: bold;
        font-family: 'Arial';
    }

    .results {
        position: absolute;
        color: white;
        top: 0;
        right: 0;
        padding: 1em;
        z-index: 1;
        font-size: 1.5em;
        font-weight: bold;
        font-family: 'Arial';
    }

    .transition {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        z-index: 100;
    }
</style>