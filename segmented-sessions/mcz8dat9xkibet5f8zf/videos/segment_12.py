from manim import *

class PlanarGraphAnimation(Scene):
    def construct(self):

        title = Text("Understanding Planar Graphs", font_size=36)
        self.play(Write(title))
        self.wait(1)

        non_planar_graph = VGroup(
            Circle(radius=0.5).shift(LEFT), 
            Circle(radius=0.5).shift(RIGHT), 
            Circle(radius=0.5).shift(UP), 
            Circle(radius=0.5).shift(DOWN)
        )
        self.play(Create(non_planar_graph))
        self.wait(2)

        self.play(FadeOut(non_planar_graph))
        planar_graph = VGroup(
            Circle(radius=0.5).shift(LEFT), 
            Circle(radius=0.5).shift(RIGHT), 
            Circle(radius=0.5).shift(UP), 
            Circle(radius=0.5).shift(DOWN)
        )
        self.play(Create(planar_graph))
        self.wait(2)

        euler_text = Text("Euler's Formula: v + f = e + 2", font_size=24)
        self.play(Write(euler_text))
        self.wait(2)

        v = 4  # vertices
        e = 4  # edges
        f = 2  # faces
        count_text = Text(f", v={v}, e={e}, f={f}", font_size=24)
        self.play(Write(count_text))
        self.wait(2)

        euler_calculation = Text(f"{v} + {f} = {e} + 2", font_size=24)
        self.play(Transform(count_text, euler_calculation))
        self.wait(2)

        k5_text = Text("K5 and K3,3 cannot be planar!", font_size=24)
        self.play(Write(k5_text))
        self.wait(2)

        k5_graph = VGroup(
            Circle(radius=0.5).shift(LEFT), 
            Circle(radius=0.5).shift(RIGHT), 
            Circle(radius=0.5).shift(UP), 
            Circle(radius=0.5).shift(DOWN), 
            Circle(radius=0.5).shift(2*LEFT)
        )
        self.play(Create(k5_graph))
        self.wait(2)

        crossing_text = Text("Too many edges cause crossings!", font_size=24)
        self.play(Write(crossing_text))
        self.wait(2)

        self.play(FadeOut(k5_graph))
        dense_graph = VGroup(
            Circle(radius=0.5).shift(LEFT), 
            Circle(radius=0.5).shift(RIGHT), 
            Circle(radius=0.5).shift(UP), 
            Circle(radius=0.5).shift(DOWN)
        )
        self.play(Create(dense_graph))
        self.wait(2)

        final_text = Text("Planarity is a property of the graph!", font_size=24)
        self.play(Write(final_text))
        self.wait(2)

        self.play(FadeOut(dense_graph), FadeOut(final_text), FadeOut(euler_text), FadeOut(count_text), FadeOut(k5_text))
        self.wait(1)

        self.wait(12)  # Adjust to ensure total time is exactly 66 seconds