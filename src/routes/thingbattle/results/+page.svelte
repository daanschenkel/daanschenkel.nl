<script>
    import {env} from "$env/dynamic/public";
	import { onMount } from "svelte";
    import {fade, fly} from "svelte/transition";
    import {goto} from "$app/navigation";
	import Page from "../+page.svelte";
    let data = [];
    let out = true;
    let running = false;
    function loadImages(){
               data.map((item) => {
                    if(item.loaded){
                        return;
                    }
                    const el = document.querySelector(`[style*="${item.thing.replaceAll(" ", "_").toLowerCase()}.png"]`);

                  

                    if(el){
                        const rect = el.getBoundingClientRect();
                        if(rect.top < window.innerHeight && rect.bottom > 0){
                            //preload
                            const img = new Image();
                            img.src = `${env.PUBLIC_CHOICES_API}/${item.thing.replaceAll(" ", "_").toLowerCase()}.png`;

                            img.onload = () => {
                                item.loaded = true;
                                data = [...data];
                            }
                            }
                    }
                });

            }

async function load(){
    if(running){
        return;
    }
    running = true;
        const response = await fetch(`${env.PUBLIC_CHOICES_API}/results`);
        data = await response.json();
        out = false;


        if(typeof window === "undefined"){
            return;
        }

        
            //on scroll, load all in view results
            window.addEventListener("scroll", () => {
                loadImages();
            });
        
            setTimeout(() => {
                loadImages();
            }, 1000);

}

load();
    



</script>



{#if out}
<div class="transition" in:fade={{duration: 500}} 
    out:fade={{duration: 500}}
></div>
{/if}

<a href="/thingbattle" class="back"
on:click|preventDefault={() => {
    out = true;
    setTimeout(() => {
        goto("/thingbattle");
    }, 500);
}}
><button>Back</button></a>
<h1>Results</h1>
<div class="results">

 

{#each data as item}
    <div 
        style="background-image: url('{env.PUBLIC_CHOICES_API}{item.loaded ? "/" : "/l/"}{item.thing.replaceAll(" ", "_").toLowerCase()}.png"
        class="result"
        on:mouseenter={() => {
           item.hover = true;
        }}
        on:mouseleave={() => {
            item.hover = false;
        }}
       

    >
    <div class="thing-overlay">
        <h2>{item.thing}</h2>
        <p>{item.percentage}%</p>
        {#if item.hover}
        <h3 class="hover"
            in:fly={{duration: 200, y: 40}}
            out:fly={{duration: 200, y: 40}}
        >{item.votes} vote(s), {item.games} game(s)</h3>
        {/if}
        </div>
    </div>
{/each}</div>

<style>
    h1 {
        text-align: center; 
        color: white;
        font-size: 3em;
    }
    .result {
        width: 200px;
        height: 200px;
        margin: 10px;
        border-radius: 10px;
        background-size: cover;
        background-position: center;
        position: relative;


    }

    .thing-overlay {

        background: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 10px;
        border-radius: 10px;

       
    }

    .thing-overlay h2 {
        font-size: 1.8em;
        text-align: center;
        color: white;
        font-weight: bold;
    }

    .thing-overlay p {
        font-size: 1.5em;
        color: white;
    }

    .results {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .back {
        position: absolute;
        top: 0;
        left: 0;
        padding: 10px;

    }

    .back button {
        font-size: 2em;
        padding: 10px;
        color: white;
        border: none;
        cursor: pointer;
        transition: 0.3s;
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

    .hover {
        font-size: 1.2em;
        color: white;
        text-align: center;
    }
  
</style>

